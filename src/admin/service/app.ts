import * as express from 'express';
import * as bodyParser from 'body-parser';

type Task = {
    plugin: string;
    variable: string[];
}
type PipelineConfig = {
    tasks: {[k:string]: Task}
}
type Pipeline = {
    name: string;
    config: PipelineConfig;
}
type Build = {
    pipeline: string;
    agent: string;
}

export function start(port: number, socketserver: string): void {
    const routage = {
        buildList: `/pipeline`,
        build: `/pipeline/:name`,
        buildInstance: `/pipeline/:name/:tag`
    };

    const app = express();
    const io = require('socket.io-client');
    const socket = io(socketserver);

    socket.on('connect', () => {
        console.log(`connected`);
    });

    socket.on('disconnect', () => {
        console.log('diconnect')
    });

    app.use(bodyParser.json());

    app.get(routage.buildList, (req, res) => {
        console.log(`List des builds`);
        res.end();
    });

    app.put(routage.build, (req, res) => {
        console.log(`Création d'un build.`);
        socket.emit('create-build', {
            name: req.params.name,
            config: req.body
        } as Pipeline);
        res.end();
    });

    app.get(routage.build, (req, res) => {
        console.log(`Obtient la config d'un build.`);
        res.end();
    });

    app.post(routage.build, (req, res) => {
        console.log(`Lancement d'un build. ${req.params.name}`);
        socket.emit('launch-build', {
            pipeline: req.params.name,
            agent: req.body?.agent || null
        } as Build);
        res.end();
    });

    app.get(routage.build, (req, res) => {
        console.log(`Liste de toutes les instances d'un build.`);
        res.end();
    });

    app.get(routage.buildInstance, (req, res) => {
        console.log(`Log de l'instance de build`);
        res.end();
    });

    app.listen(port, () => {
        console.log(`listening at http://localhost:${port}`);
        socket.emit('admin');
    });

    console.log(`connecting to engine...`);
} 