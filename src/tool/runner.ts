import { spawn, spawnSync } from 'child_process';

export class Runner {
    constructor(
        private readonly _buildFolder: string,
        private readonly _config: PipelineConfig,
        private readonly _pathBuilder: PathBuilder
    ) {
        spawnSync('powershell', [`cp -r "${this._config.path}/*" "${_buildFolder}"`]);
    }

    async run(log: (msg: string) => void): Promise<void> {
        return new Promise<void>(resolve => {
            const child = this.exec(`${this._config.entry}`);

            child.stdout.on('data', (data) => log(data.toString()));
            child.stderr.on('data', (data) => log(data.toString()));
            child.on('close', () => { 
                resolve();
            });
        });
    }

    private exec(command: string) {
        if (!/^win/.test(process.platform)) { // linux
            return spawn(command, [], {
                cwd: this._pathBuilder.resolve(this._buildFolder),
                env: process.env
            });
        } else { // windows
            return spawn('cmd', ['/s', '/c', command], {
                cwd: this._pathBuilder.resolve(this._buildFolder),
                env: process.env
            });
        }
    }
}