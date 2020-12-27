import { spawn } from 'child_process';
const process = require('process');

export function execute(command: string) {
    return new Promise<void>((resolve, reject) => {
        if (!/^win/.test(process.platform)) { // linux
            var child = spawn(command, [], {
                stdio: [null, process.stdout, process.stderr]
            });
            child.on("close", () => resolve())
        } else { // windows
            const child = spawn('powershell', [command], {
                stdio: [null, process.stdout, process.stderr]
            });
            child.on("close", () => resolve())
        }
    });
}