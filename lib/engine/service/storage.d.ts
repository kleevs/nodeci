declare type Task = {
    plugin: string;
    variable: string[];
};
declare type PipelineConfig = {
    tasks: {
        [k: string]: Task;
    };
};
export declare function write(pipeline: {
    [k: string]: PipelineConfig;
}): void;
export declare function read(): Promise<{
    [k: string]: PipelineConfig;
}>;
export {};
