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
                        path: config.pipeline[name] as string,
                        entry: 'index.js',
                        cmd: 'node'
                    }
                } else {
                    const info = config.pipeline[name] as {
                        path: string;
                        entry: string;
                        cmd: string;
                    };
                    result[name] = {
                        path: info?.path || '.',
                        entry: info?.entry || 'index.js',
                        cmd: info?.cmd || 'node'
                    }
                }
            } catch (e) {}
        }
        
        return result;
    }
}