export declare function updateStorage(callback: (v: Storage) => Storage): void;
export declare function onUpdateStorage(callback: (v: Storage) => void): () => void;
export declare function getStorage(): {
    pipeline: PipelineMetadata;
    logs: {
        [pipelinename: string]: LogMetadata;
    };
};
