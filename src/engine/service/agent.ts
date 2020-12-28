import { Socket } from 'socket.io';
import { Queue } from './queue';

type PipelineConfig = {
    tasks: {[k:string]: unknown}
}

export class Agent {
    private _isBusy = false;
    private readonly _queue = new Queue<PipelineConfig>();

    constructor(private readonly _socket: Socket, private readonly _doWork: (v: Agent) => void) {
        this._socket.on('finish', () => { 
            if(!this._queue.shift((config) => {
                this.build(config);
                return Promise.resolve(true);
            })) {
                this._isBusy = false; 
                _doWork(this);
            }
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