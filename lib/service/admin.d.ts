export declare class Admin {
    private readonly _engine;
    private readonly _storage;
    private readonly _cryptoTools;
    private readonly _ioFile;
    private readonly _user;
    constructor(_engine: EngineInterface, _storage: StorageAccessor, _cryptoTools: CryptoTool, _ioFile: IOFileSync, _user: UserWriter);
    listPipeline(): any[];
    listBuild(pipelineName: string): any[];
    getBuild(pipelineName: string, buildId: string): string;
    createPipeline(name: string, config: PipelineConfig): void;
    createBuild(name: string, agent: string): void;
    createUser(login: string, password: string): void;
}
