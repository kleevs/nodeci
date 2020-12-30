export class Admin {
    constructor(
        private readonly _engine: EngineInterface, 
        private readonly _storage: StorageAccessor,
        private readonly _cryptoTools: CryptoTool,
        private readonly _ioFile: IOFileSync,
        private readonly _user: UserWriter,
    ) {}

    listPipeline() {
        const storage = this._storage.get();
        const result = [];
        for (var pipeline in storage?.pipeline) {
            result.push(pipeline);
        }
        return result;
    }

    listBuild(pipelineName: string) {
        const result = [];
        const storage = this._storage.get();
        for (var id in storage?.logs[pipelineName]) {
            const log = storage?.logs[pipelineName][id];
            result.push({
                id: id,
                date: log.date,
                successfull: log.successfull,
                agent: log.agent
            });
        }
        return result;
    }

    getBuild(pipelineName: string, buildId: string) {
        const storage = this._storage.get();
        const log = storage?.logs[pipelineName][buildId];
        const result = this._ioFile.read(`${log.file}`);
        return result;
    }

    createPipeline(name: string, config: PipelineConfig) {
        this._engine.createPipeline({
            name,
            config
        });
    }

    createBuild(name: string, agent: string) {
        this._engine.createBuild({
            pipeline: name,
            agent: agent || null
        });
    }

    createUser(login: string, password: string) {
        const hash = this._cryptoTools.computeHash(login, password);
        this._user.update(users => ({
            ...users,
            [login]: {
                password: hash
            }
        }));
    }
}