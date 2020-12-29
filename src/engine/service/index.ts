import { Agent } from './agent';
import { Server, Socket } from 'socket.io';
import { Queue } from './queue';
import { appendLog } from './storage';
import { getReadOnlyPipeline } from './pipeline';
import { mkdirSync } from '../../shared/iofile';
import { EventManager } from '../../shared/event-manager';
import { getStorage, onUpdateStorage, updateStorage } from './storage-data';

export function start(port: number, rootDir: string, config: Config): void {
    const listeners: Listeners  = {};
    const globalQueue: Queue<Pipeline> = new Queue();
    const agentNames: {[k:string]:string} = {};
    const io: Server = require('socket.io')(port);
    const logManager = new EventManager<Log>();

    logManager.on(({id, message}) => {
        appendLog({id, message});
        console.log(message);
    });

    logManager.on(({id, pipeline, agent}) => {
        updateStorage(storage => {
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
    })

    mkdirSync('./.nodeci/logs');
    getReadOnlyPipeline(rootDir, config).then((array) => {
        const result: PipelineMetadata = {};
        array.forEach(_ => {
            result[_.name] = _.config;
        });
        updateStorage(storage => ({
            ...storage,
            pipeline: {
                ...storage.pipeline,
                ...result
            }
        }));
    });

    console.log(`listening on port ${port}`);
    io.on('connection', (socket: Socket) => {
        listeners[socket.id] = {
            isAgent: false,
            isAdmin: false,
            agent: null
        };

        socket.on('disconnect', () => {
            console.log(`disconnected ${socket.id}`);
            delete listeners[socket.id];
        });

        // if it's build agent
        socket.on('agent', (msg) => {
            const { name } = msg;
            console.log(`an agent connected ${socket.id} ${name}`);
            const agent = listeners[socket.id];
            agent.isAgent = true;
            agent.agent = new Agent(socket, (me) => {
                globalQueue.shift((config) => {
                    if (!me.isBusy()) {
                        me.run(config);
                        return Promise.resolve(true);
                    }
            
                    return Promise.resolve(false);
                });
            }, (v) => {
                logManager.fire({...v, agent: name});
            });
            agentNames[name] = socket.id;
        });

        // if it's admin agent
        socket.on('admin', () => {
            console.log(`an admin connected ${socket.id}`);
            listeners[socket.id].isAdmin = true;

            onUpdateStorage(storage => {
                socket.emit('storage', storage);
            });

            // create a pipeline
            socket.on('create-build', (pipeline: Pipeline) => {
                updateStorage(storage => ({
                    ...storage,
                    pipeline: {
                        ...storage.pipeline,
                        [pipeline.name]: pipeline.config
                    }
                }))
            });

            // launch a pipeline
            socket.on('launch-build', (build: Build) => {
                const config = getStorage().pipeline[build.pipeline];
                const agentName = build.agent;
                const metadata = { config, name: build.pipeline };

                if(agentName && agentNames[agentName] && listeners[agentNames[agentName]]) {
                    listeners[agentNames[agentName]].agent.run(metadata);
                } else {
                    globalQueue.push(metadata);
                    for (var id in listeners) {
                        if (listeners[id].isAgent) {
                            if (!listeners[id].agent.isBusy()) {
                                listeners[id].agent.doWork();
                            }
                        }
                    }
                }           
            });
        });
    });
} 