import { Socket } from 'socket.io';
import * as fs from 'fs';
import * as path from 'path';

type Task = {
    plugin: string;
    variable: string[];
}
type PipelineConfig = {
    tasks: {[k:string]: Task}
}
type Build = {
    config: PipelineConfig;
}

export function start(host: string, name: string, currentPath: string) {
    const io = require('socket.io-client');
    const socket: Socket = io(host);
    const rootDir = currentPath.replace(/\\/gi, '/');
 
    socket.on('connect', () => {
        console.log(`is connected as ${socket.id}`);
        socket.emit('agent', { name: name });
    });

    socket.on('run', async (build: Build) => {
        const directory = (() => { 
            let tmp: string = null;
            while (!tmp || fs.existsSync(tmp)) {
                const date = new Date();
                const strDate = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getHours()}${date.getMinutes()}`;
                tmp = `./.nodeci/work/${strDate}${Math.round(Math.random()*1000)}`;
            }
            return tmp;
        })();
        const workpath = path.resolve(rootDir, directory);
        fs.mkdirSync(directory, { recursive: true });
        const context = {
            workfolder: workpath
        }
        
        for (var name in build.config.tasks) {
            const task = build.config.tasks[name];
            try {
                const variable = ([context] as [any, ...string[]]).concat(task.variable);
                await require(`../../plugin/${task.plugin}`).default.apply(this, variable);
            } catch (e) {
                console.error('error task', e);
                break;
            }
        }
        setTimeout(() => {
            socket.emit('finish');
        }, 5000);
    });

    socket.on('disconnect', () => {
        console.log('diconnect')
    });

    console.log(`start agent`);
}