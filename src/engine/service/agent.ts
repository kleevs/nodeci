import { Socket } from 'socket.io';
import { Queue } from './queue';

export class Agent {
    private _isBusy = false;
    private readonly _queue = new Queue<Pipeline>();

    constructor(private readonly _socket: Socket, private readonly _doWork: (v: Agent) => void, log: (v: { id: string, index: number, message: string, pipeline: string }) => void) {
        this._socket.on('finish', () => { 
            if(!this._queue.shift((config) => {
                this.build(config);
                return Promise.resolve(true);
            })) {
                this._isBusy = false; 
                _doWork(this);
            }
        });

        this._socket.on('log', log);
        _doWork(this);
    }

    isBusy() { return this._isBusy; }

    run(config: Pipeline) {
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

    private build(config: Pipeline) {
        this._socket.emit('run', {
            name: config.name,
            config: config.config
        } as AgentBuild);
    }
}