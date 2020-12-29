import * as express from 'express';
import * as bodyParser from 'body-parser';
import { readSync } from '../../shared/iofile';
import { basicAuth, computeHash, toBasicAuth } from './authorization';
import { getUsers, updateUsers } from './storage';

export function start(port: number, socketserver: string): void {
    const routage = {
        pipelineList: `/pipeline`,
        build: `/pipeline/:name`,
        buildInstance: `/pipeline/:name/:id`,
        user: `/user`
    };

    const app = express();
    const io = require('socket.io-client');
    const socket = io(socketserver);
    const data: {
        storage: Storage
    } = {
        storage: null
    }

    socket.on('connect', () => {
        console.log(`connected`);
    });

    socket.on('disconnect', () => {
        console.log('diconnect')
    });

    socket.on('storage', (storage: Storage) => {
        data.storage = storage
    })

    app.use(basicAuth(getUsers));
    app.use(bodyParser.json());

    app.get(routage.pipelineList, (req, res) => {
        const result = [];
        for (var pipeline in data.storage?.pipeline) {
            result.push(pipeline);
        }
        res.end(JSON.stringify(result));
    });

    app.put(routage.build, (req, res) => {
        socket.emit('create-build', {
            name: req.params.name,
            config: req.body
        } as Pipeline);
        res.end();
    });

    app.get(routage.build, (req, res) => {
        const result = [];
        for (var id in data.storage?.logs[req.params.name]) {
            const log = data.storage?.logs[req.params.name][id];
            result.push({
                id: id,
                date: log.date,
                successfull: log.successfull,
                agent: log.agent
            });
        }
        res.end(JSON.stringify(result));
    });

    app.post(routage.build, (req, res) => {
        socket.emit('launch-build', {
            pipeline: req.params.name,
            agent: req.body?.agent || null
        } as Build);
        res.end();
    });

    app.get(routage.buildInstance, (req, res) => {
        const log = data.storage?.logs[req.params.name][req.params.id];
        const result = readSync(`${log.file}`);
        res.end(result);
    });

    app.post(routage.user, (req, res) => {
        const password = computeHash(toBasicAuth(req.body.login, req.body.password));
        updateUsers(users => ({
            ...users,
            [req.body.login]: {
                password
            }
        }));
        res.end();
    })

    app.listen(port, () => {
        console.log(`listening at http://localhost:${port}`);
        socket.emit('admin');
    });

    console.log(`connecting to engine...`);
} 