export declare class Agent implements EngineAgent {
    private readonly _rootFolder;
    private readonly _name;
    private readonly _ioFile;
    private readonly _queue;
    private readonly _globalQueue;
    private readonly _pathBuilder;
    private readonly _logger;
    private readonly _taskFactory;
    private readonly _pinger;
    private _isBusy;
    constructor(_rootFolder: string, _name: string, _ioFile: IOFileSync, _queue: ToolsQueue<Pipeline>, _globalQueue: ToolsQueue<Pipeline>, _pathBuilder: PathBuilder, _logger: Logger, _taskFactory: ToolsTaskFactory, _pinger: Pinger);
    isBusy(): boolean;
    run(config: Pipeline): void;
    doWork(): void;
    private build;
    private findFreeFolderName;
}
