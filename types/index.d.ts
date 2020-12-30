declare type Task = {
    plugin: string;
    variable: unknown;
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
type AgentBuild = {
    name: string;
    config: PipelineConfig;
}
declare type Build = {
    pipeline: string;
    agent: string;
}

declare type Agent = {
    isBusy(): boolean;
    run(config: Pipeline): void;
    doWork(): void;
}

declare type Config = {
    port: number;
    socket: {
        pathname: string;
    },
    api: {
        pathname: string;
    },
    pipeline: { [name:string]: string; }
}

type BuildContext = {
    workfolder: string;
    rootFolder: string;
} 

type Log = { 
    id: string; 
    index: number; 
    message: string;
    pipeline: string;
    agent: string;
}

type LogHint = { 
    id: string; 
    index: number; 
    message: string;
    pipeline: string;
}

type LogMetadata =  {[buildid:string]: {
    file: string;
    date: {
        start: number;
        end: number;
    };
    successfull: boolean;
    agent: string;
}};

type PipelineMetadata = {[pipelinename:string]: PipelineConfig} 

type Storage = {
    pipeline: PipelineMetadata;
    logs:  {[pipelinename:string]: LogMetadata};
}

type User = {
    password: string;
}

type Users = {[login:string]: User}