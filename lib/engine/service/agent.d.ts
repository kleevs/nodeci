import { Socket } from 'socket.io';
declare type PipelineConfig = {
    tasks: {
        [k: string]: unknown;
    };
};
export declare class Agent {
    private readonly _rootDir;
    private readonly _socket;
    private readonly _doWork;
    private _isBusy;
    private readonly _queue;
    constructor(_rootDir: string, _socket: Socket, _doWork: (v: Agent) => void);
    isBusy(): boolean;
    run(config: PipelineConfig): void;
    doWork(): void;
    private build;
}
export {};
