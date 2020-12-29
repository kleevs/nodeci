import { appendFile } from '../../shared/iofile';
import { Socket } from 'socket.io';
import { Queue } from './queue';
import * as path from 'path';

type PipelineConfig = {
    tasks: {[k:string]: unknown}
}

export class Agent {
    private _isBusy = false;
    private readonly _queue = new Queue<PipelineConfig>();

    constructor(private readonly _rootDir: string, private readonly _socket: Socket, private readonly _doWork: (v: Agent) => void) {
        this._socket.on('finish', () => { 
            if(!this._queue.shift((config) => {
                this.build(config);
                return Promise.resolve(true);
            })) {
                this._isBusy = false; 
                _doWork(this);
            }
        });
        this._socket.on('log', ({id, index, message}: { id: string, index: number, message: string }) => {
            appendFile(path.resolve(this._rootDir, `./.nodeci/logs/${id}.log.txt`), `${message}\r\n`);
            console.log(message);
        });

        _doWork(this);
    }

    isBusy() { return this._isBusy; }

    run(config: PipelineConfig) {
        if (!this._isBusy) {
            this._isBusy = true;
            this.build(config);
        } else {
            this._queue.push(config);
        }
    }

    doWork() {
        if (!this._isBusy) {
            this._doWork(this);
        }
    }

    private build(config: PipelineConfig) {
        this._socket.emit('run', {
            config: config
        });
    }
}