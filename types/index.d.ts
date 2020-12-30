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
    pipeline: { [name:string]: string; }
}

type BuildContext = {
    workFolder: string;
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

type StorageData = {
    pipeline: PipelineMetadata;
    logs:  {[pipelinename:string]: LogMetadata};
}

type UserData = {
    password: string;
}

type UsersData = {[login:string]: UserData}

type Socket = {
    on<T>(key: string, callback: (msg: T) => void): void;
    emit<T>(key: string, value: T): void;
}

type AdminSocket = {
    createPipeline(config: Pipeline): void;
    launchPipeline(config: Build): void;
}

type AgentSocket = {
    run(config: AgentBuild): void;
}

type StorageAccessor = { 
    get: () => StorageData; 
}
type StorageWriter = { 
    update: (callback: (v: StorageData) => StorageData)=>void;
}
type UserWriter = { 
    update: (callback: (v: UsersData) => UsersData)=>void;
}
type CryptoTool = {
    computeHash: (login: string, password: string) => string;
}
type IOFileSync = {
    exist(filename: string): boolean;
    mkdir(folder: string): void;
    read(filename: string): string;
    write(filename: string, content: string): void;
}

type IOFileAsync = {
    exist(filename: string): Promise<boolean>;
    mkdir(folder: string): Promise<void>;
    read(filename: string): Promise<string>;
    write(filename: string, content: string): Promise<void>;
}

type EngineAgent = {
    run(v: Pipeline): void;
    isBusy(): boolean;
    doWork(): void;
};

type ToolsQueue<T> = {
    push(build: T): void;
    shift(callback: (v: T)=>Promise<boolean>): boolean;
}

type PathBuilder = {
    resolve(...paths: string[]): string;
}

type Logger = {
    info(key: string, v: string): void;
}

type ToolsTask = {
    run(log: (msg: string) => void): Promise<void>;
}

type ToolsTaskFactory = {
    build(v: {
        context: BuildContext, 
        name: string, 
        task: Task
    }): ToolsTask;
}

type EngineInterface = {
    createPipeline(config: Pipeline): void;
    createBuild(build: Build): void;
}

type ToolsEventManager<T> = {
    on(callback: (v: T) => void): () => void;
    fire(v: T): void;
}

type Pinger = {
    start(pipeline: string, agent: string, id: string): void;
}

type AdminInterface = {
    listPipeline(): string[]
    listBuild(pipelineName: string): {
        id: string;
        date: number;
        successfull: boolean;
        agent: string;
    }[];
    getBuild(pipelineName: string, buildId: string): string;
    createPipeline(name: string, config: PipelineConfig): void;
    createBuild(name: string, agent: string): void;
    createUser(login: string, password: string): void;
}

type ConfigAccessorInterface = { getConfig(config: Config): PipelineMetadata }
