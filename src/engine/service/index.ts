import { Agent } from './agent';
import { Server, Socket } from 'socket.io';
import { Queue } from './queue';
import { read as readStoragePipeline, write as writeStoragePipeline } from './storage';
import { getConfig } from './config';
import { getReadOnlyPipeline } from './pipeline';

export function start(port: number, c: Config): void {
    const listeners: Listeners  = {};
    const globalQueue: Queue<PipelineConfig> = new Queue();
    const agentNames: {[k:string]:string} = {};
    const pipelines: {[k:string]: PipelineConfig} = {};
    const io: Server = require('socket.io')(port);
    const config = getConfig(c);

    getReadOnlyPipeline(config).then((pipelines) => {
        pipelines.forEach(_ => {
            if (!pipelines[_.name]) {
                pipelines[_.name] = _.config;
            }
        });
    }).then(() => {
        readStoragePipeline().then(_ => {
            for (var i in _) {
                if (!pipelines[i]) {
                    pipelines[i] = _[i];
                }
            }
        });
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
            });
            agentNames[name] = socket.id;
        });

        // if it's admin agent
        socket.on('admin', () => {
            console.log(`an admin connected ${socket.id}`);
            listeners[socket.id].isAdmin = true;

            // create a pipeline
            socket.on('create-build', (pipeline: Pipeline) => {
                pipelines[pipeline.name] = pipeline.config;
                writeStoragePipeline(pipelines);
            });

            // launch a pipeline
            socket.on('launch-build', (build: Build) => {
                const config = pipelines[build.pipeline];
                const agentName = build.agent;

                if(agentName && agentNames[agentName] && listeners[agentNames[agentName]]) {
                    listeners[agentNames[agentName]].agent.run(config);
                } else {
                    globalQueue.push(config);
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