import { resolve } from 'path';
import { Agent } from "./agent";
import { Admin } from "./admin";
import { Engine } from "./engine";
import { Queue } from "../tool/queue";
import { Storage } from "./storage";
import { User } from "./user";
import { EventManager } from "../tool/event-manager";
import { IOFileAsync, IOFileSync } from "../tool/iofile";
import { Crypto } from "../tool/crypto";
import { Task } from '../tool/task';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { basicAuth } from '../middleware/authorization';
import { start as startServer } from '../server/api';
import { contentType } from '../middleware/content-type';
import { ConfigAccessor } from './config';

export function start (config: Config) {
    const port = config.port;
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
    const logger: Logger = {
        info: (id: string, msg: string) => {
            console.log(msg);
            ioFileAsync.appendFile(`./.nodeci/logs/${id}.log.txt`, msg);
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
    const taskFactory: ToolsTaskFactory = {
        build: (v: {
            context: BuildContext;
            name: string;
            task: globalThis.Task;
        }) => new Task(ioFile, pathBuilder, v.context, v.name, v.task)
    }

    const engine = new Engine(storageAccessor, agents, globalQueue); 
    new Agent('self-hosted', ioFile, new Queue(), globalQueue, pathBuilder, logger, taskFactory, pinger);
    const admin = new Admin(engine, storageAccessor, cryptoTools, ioFile, user);

    const app = express();
    app.use(basicAuth(() => users.getUser()));
    app.use(contentType());
    app.use(bodyParser.json());
    startServer(app, admin);

    app.listen(port, () => {
        console.log(`listening at http://localhost:${port}`);
    });
}