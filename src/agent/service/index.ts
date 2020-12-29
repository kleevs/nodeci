import { Socket } from 'socket.io';
import { createWorkingFolder } from './folder';
import { Task } from './task';

export function start(host: string, name: string, currentPath: string) {
    const io = require('socket.io-client');
    const socket: Socket = io(host);
    const rootDir = currentPath.replace(/\\/gi, '/');
    const lognumber = { length: 0 };
    const logger = (id: string, msg: string) => {
        lognumber.length++;
        socket.emit('log', { id: id, index: lognumber.length, message: msg?.replace(/\r?\n$/gi, '').replace(/^\r?\n/gi, '') || '' });
    }
    socket.on('connect', () => {
        console.log(`is connected as ${socket.id}`);
        socket.emit('agent', { name: name });
    });

    socket.on('run', async (build: AgentBuild) => {
        const { workingFolderAbsolutePath, id } = createWorkingFolder(rootDir);
        const log = (msg: string) => msg?.toString() && logger(id, msg.toString());
        log(`pipeline ${name}`);
        try {
            log(`preparing...`);
            const tasks: Task[] = [];
            const context = {
                workfolder: workingFolderAbsolutePath,
                rootFolder: rootDir
            }
            
            for (let taskname in build.config.tasks) {
                const task = build.config.tasks[taskname];
                tasks.push(new Task(context, taskname, task));
            }

            log(`starting...`);

            for (let i in tasks) {
                await tasks[i].run(log);
            }
        } catch (e) {
            log(e);
            log(e);
        }

        log(`pipeline ${name} finished`)
        socket.emit('finish');
    });

    socket.on('disconnect', () => {
        console.log('diconnect')
    });

    console.log(`start agent`);
}