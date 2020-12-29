export declare class Task {
    private readonly context;
    private readonly name;
    constructor(context: BuildContext, name: string, task: globalThis.Task);
    run(log: (msg: string) => void): Promise<void>;
}
