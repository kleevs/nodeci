export class ConfigAccessor {
    constructor(
        private readonly _pathBuilder: PathBuilder,
        private readonly _ioFile: IOFileSync
    ) {}

    getConfig(config: Config): PipelineMetadata {
        const result: PipelineMetadata = {};
        for (let name in config.pipeline) {
            try {
                if (typeof config.pipeline[name] === "string") {
                    result[name] = {
                        path: config.pipeline[name],
                        entry: 'index.js'
                    }
                }
            } catch (e) {}
        }
        
        return result;
    }
}