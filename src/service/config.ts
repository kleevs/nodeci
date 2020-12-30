export class ConfigAccessor {
    constructor(
        private readonly _pathBuilder: PathBuilder,
        private readonly _ioFile: IOFileSync
    ) {}

    getConfig(config: Config): PipelineMetadata {
        const result: PipelineMetadata = {};
        for (let name in config.pipeline) {
            try {
                const pathfilename = this._pathBuilder.resolve('./', config.pipeline[name]);
                const str = this._ioFile.read(pathfilename);
                result[name] = JSON.parse(str);
            } catch (e) {}
        }
        
        return result;
    }
}