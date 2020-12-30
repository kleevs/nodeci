export declare class Task {
    private readonly _pathBuilder;
    private readonly _context;
    private readonly _name;
    constructor(_iofile: IOFileSync, _pathBuilder: PathBuilder, _context: BuildContext, _name: string, _task: globalThis.Task);
    run(log: (msg: string) => void): Promise<void>;
    private _buildContentFile;
}
