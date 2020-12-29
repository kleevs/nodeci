import { Socket } from 'socket.io';
export declare class Agent {
    private readonly _socket;
    private readonly _doWork;
    private _isBusy;
    private readonly _queue;
    constructor(_socket: Socket, _doWork: (v: Agent) => void, log: (v: {
        id: string;
        index: number;
        message: string;
        pipeline: string;
    }) => void);
    isBusy(): boolean;
    run(config: Pipeline): void;
    doWork(): void;
    private build;
}
