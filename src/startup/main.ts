import { resolve } from 'path';
import { Agent } from "../service/agent";
import { Admin } from "../service/admin";
import { Engine } from "../service/engine";
import { Queue } from "../tool/queue";
import { Storage } from "../service/storage";
import { User } from "../service/user";
import { EventManager } from "../tool/event-manager";
import { IOFileAsync, IOFileSync } from "../tool/iofile";
import { Crypto } from "../tool/crypto";
import { Task } from '../tool/task';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { basicAuth } from '../middleware/authorization';
import { start as startServer } from '../server/api';
import { contentType } from '../middleware/content-type';
import { ConfigAccessor } from '../service/config';
import { createServer } from 'http';
import { Runner } from '../tool/runner';

export function start (config: Config) {
    const port: number = config.port.http;
    const ioFileAsync = new IOFileAsync();
    const users = new User(new EventManager(), ioFileAsync);
    const agents = {}
    const globalQueue = new Queue<Pipeline>();
    const cryptoTools: CryptoTool = new Crypto();
    const ioFile: IOFileSync = new IOFileSync();
    const pathBuilder: PathBuilder = {
        resolve: (...paths: string[]) => resolve.apply(resolve, paths)
    }
    const pipelineConfig = new ConfigAccessor(pathBuilder, ioFile).getConfig(config);
    const storage = new Storage(pipelineConfig, new EventManager(), ioFileAsync);
    const user: UserWriter = {
        update: (callback: (v: UsersData) => UsersData) => users.updateUser(callback)
    }
    const storageAccessor = {
        get: () => storage.getStorage(),
        update: (callback: (v: StorageData) => StorageData) => storage.updateStorage(callback)
    };
    ioFile.mkdir(`./.nodeci/logs`);
    const logger: Logger = {
        info: (id: string, msg: string) => {
            const message = msg?.replace(/\r?\n$/gi, '');
            console.log(message);
            ioFileAsync.appendFile(`./.nodeci/logs/${id}.log.txt`, `${message}\r\n`);
        }
    }
    const pinger: Pinger = {
        start: (pipeline, agent, id) => storage.updateStorage(storage => {
            const file = storage.logs[pipeline] && storage.logs[pipeline][id] && storage.logs[pipeline][id].file;
            return {
                ...storage, 
                logs: {
                    ...storage.logs,
                    [pipeline]: {
                        ...storage.logs[pipeline],
                        [id]: {
                            file: file || `./.nodeci/logs/${id}.log.txt`,
                            date: {
                                start: 0,
                                end: 0
                            },
                            agent,
                            successfull: true
                        }
                    }
                }
            }
        })
    }
    const taskFactory: ToolsRunnerFactory = {
        build: (v: {
            context: PipelineConfig,
            buildFolder: string
        }) => new Runner(v.buildFolder, v.context, pathBuilder)
    }

    const engine = new Engine(storageAccessor, agents, globalQueue); 
    const agent = new Agent(process.cwd(), 'self-hosted', ioFile, new Queue(), globalQueue, pathBuilder, logger, taskFactory, pinger);
    const admin = new Admin(engine, storageAccessor, cryptoTools, ioFile, user);
    agents['self-hosted'] = agent;
    const app = express();
    app.use(basicAuth(() => users.getUser()));
    app.use(contentType());
    app.use(bodyParser.json());
    startServer(app, admin);

    createServer(app).listen(port, () => {
        console.log(`listening at http://localhost:${port}`);
    });
}