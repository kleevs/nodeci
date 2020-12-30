import { spawn } from 'child_process';
import * as process from 'process';

export function execute(command: string);
export function execute(command: string, log: (msg: string) => void);
export function execute(command: string, log?: (msg: string) => void) {
    return new Promise<void>((resolve) => {
        const stdout = process.stdout;
        const stderr = process.stderr;

        if (!/^win/.test(process.platform)) { // linux
            var child = spawn(command, [], {
                stdio: [null, stdout, stderr]
            });
            child.on("close", () => resolve())
        } else { // windows
            const child = spawn('powershell', [command], {
                stdio: [null, stdout, stderr]
            });
            child.on("close", () => resolve())
            child.on("message", (msg) => log(msg?.toString()));
        }
    });
}

export default async function (context: BuildContext, commands: string[]) {
    await execute(commands?.join(";"));
}