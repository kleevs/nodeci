export declare function write(pipeline: {
    [k: string]: PipelineConfig;
}): void;
export declare function read(): Promise<{
    [k: string]: PipelineConfig;
}>;
