export declare function write(pipeline: {
    [k: string]: PipelineConfig;
}): void;
export declare function read(): Promise<{
    [k: string]: PipelineConfig;
}>;
export declare function appendLog({ id, message }: {
    id: string;
    message: string;
}): void;
export declare function writeLogMetadata(metadata: LogMetadata): void;
export declare function readLogMetadata(): Promise<LogMetadata>;
