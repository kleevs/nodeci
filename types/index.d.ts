declare type Task = {
    plugin: string;
    variable: string[];
}
declare type Listeners = {[k:string]: {
    isAgent: boolean,
    isAdmin: boolean,
    agent: Agent
}}
declare type PipelineConfig = {
    tasks: {[k:string]: Task}
}
declare type Pipeline = {
    name: string;
    config: PipelineConfig;
}
declare type Build = {
    pipeline: string;
    agent: string;
}

declare type Agent = {
    isBusy(): boolean;
    run(config: PipelineConfig): void;
    doWork(): void;
}

declare type Config = {
    socket: {
        port: number;
    },
    api: {
        port: number;
    },
    pipeline: { [name:string]: string; }
}