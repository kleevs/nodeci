import { spawn } from 'child_process';
import * as path from 'path';
import { writeSync } from '../../shared/iofile';

export class Task {
    constructor(private readonly context: BuildContext, private readonly name: string, task: globalThis.Task) {
        writeSync(path.resolve(context.workfolder, `${name}.js`), buildContentFile(context, task));
    }

    async run(log: (msg: string) => void): Promise<void> {
        return new Promise<void>(resolve => {
            const child = spawn('powershell', [`node "../${this.name}.js"`], {
                cwd: path.resolve(this.context.workfolder, 'build')
            });

            child.stdout.on('data', (data) => log(data.toString()));
            child.stderr.on('data', (data) => log(data.toString()));
            child.on('close', () => { 
                resolve();
            });
        });
    }
}

const buildContentFile = (context: BuildContext, task: globalThis.Task) => `
    const context = ${JSON.stringify({
        workfolder: `${context.workfolder}/build`,
        rootFolder: context.rootFolder
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