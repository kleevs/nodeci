import { spawn } from 'child_process';

export class Task {
    constructor(
        _iofile: IOFileSync,
        private readonly _pathBuilder: PathBuilder,
        private readonly _context: BuildContext, 
        private readonly _name: string, 
        _task: globalThis.Task
    ) {
        _iofile.write(this._pathBuilder.resolve(_context.workFolder, `${_name}.js`), this._buildContentFile(_context, _task));
    }

    async run(log: (msg: string) => void): Promise<void> {
        return new Promise<void>(resolve => {
            const child = spawn('powershell', [`node "../${this._name}.js"`], {
                cwd: this._pathBuilder.resolve(this._context.workFolder, 'build')
            });

            child.stdout.on('data', (data) => log(data.toString()));
            child.stderr.on('data', (data) => log(data.toString()));
            child.on('close', () => { 
                resolve();
            });
        });
    }

    private _buildContentFile(context: BuildContext, task: globalThis.Task) {
        return `
    const context = ${JSON.stringify({
        workFolder: `${context.workFolder}/build`
    } as BuildContext)};
    const variable = ${JSON.stringify(task.variable)};
    const plugin = (() => {
        try {
            return require("../../../plugin/${task.plugin}");
        } catch (e) {
            try {
                return require("nodeci/lib/plugin/${task.plugin}");
            } catch (e) {
                return require("../../../lib/plugin/${task.plugin}");
            }
        }
    })();
    plugin.default(context, variable);
`;
    }
}