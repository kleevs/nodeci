export class Engine {
    constructor(
        private readonly _storage: StorageAccessor & StorageWriter,
        private readonly _agents: { [agentName: string]: EngineAgent },
        private readonly _queue: ToolsQueue<Pipeline>,
    ) {}

    createPipeline(config: Pipeline) {
        this._storage.update(storage => ({
            ...storage,
            pipeline: {
                ...storage.pipeline,
                [config.name]: config.config
            }
        }))
    }

    createBuild(build: Build) {
        const config = this._storage.get()?.pipeline[build.pipeline];
        const agentName = build.agent;
        const metadata: Pipeline = { config, name: build.pipeline };
        const agentNames = this._agents;

        if(agentName && agentNames[agentName]) {
            agentNames[agentName].run(metadata);
        } else {
            this._queue.push(metadata);
            for (var name in agentNames) {
                if (!agentNames[name].isBusy()) {
                    agentNames[name].doWork();
                }
            }
        } 
    }
}