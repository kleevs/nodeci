export declare class Engine {
    private readonly _storage;
    private readonly _agents;
    private readonly _queue;
    constructor(_storage: StorageAccessor & StorageWriter, _agents: {
        [agentName: string]: EngineAgent;
    }, _queue: ToolsQueue<Pipeline>);
    createPipeline(config: Pipeline): void;
    createBuild(build: Build): void;
}
