export declare class ConfigAccessor {
    private readonly _pathBuilder;
    private readonly _ioFile;
    constructor(_pathBuilder: PathBuilder, _ioFile: IOFileSync);
    getConfig(config: Config): PipelineMetadata;
}
