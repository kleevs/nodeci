export declare class Runner {
    private readonly _buildFolder;
    private readonly _config;
    private readonly _pathBuilder;
    constructor(_buildFolder: string, _config: PipelineConfig, _pathBuilder: PathBuilder);
    run(log: (msg: string) => void): Promise<void>;
    private exec;
}
