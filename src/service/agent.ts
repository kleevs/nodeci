export class Agent implements EngineAgent {
    private _isBusy = false;

    constructor(
        private readonly _rootFolder: string,
        private readonly _name: string,
        private readonly _ioFile: IOFileSync,
        private readonly _queue: ToolsQueue<Pipeline>,
        private readonly _globalQueue: ToolsQueue<Pipeline>,
        private readonly _pathBuilder: PathBuilder,
        private readonly _logger: Logger,
        private readonly _taskFactory: ToolsTaskFactory,
        private readonly _pinger: Pinger
    ) {}

    isBusy() { return this._isBusy; }

    async run(config: Pipeline) {
        if (!this._isBusy) {
            this._isBusy = true;
            await this.build(config);
            if(!this._queue.shift(async (config) => {
                await this.build(config);
                return Promise.resolve(true);
            })) {
                this._isBusy = false; 
                this.doWork();
            }
        } else {
            this._queue.push(config);
        }
    }

    doWork() {
        this._globalQueue.shift((config) => {
            if (!this.isBusy()) {
                this.run(config);
                return Promise.resolve(true);
            }
    
            return Promise.resolve(false);
        });
    }

    private async build(config: Pipeline) {
        const workContainer = `./.nodeci/work`;
        const id = this.findFreeFolderName(workContainer);
        const workFolder = this._pathBuilder.resolve(workContainer, id);
        const buildFolder = this._pathBuilder.resolve(workFolder, 'build');
        this._pinger.start(config.name, this._name, id);
        try {
            this._logger.info(id, `pipeline ${config.name}`);
            this._logger.info(id, `preparing...`);
            const build = config;
            this._ioFile.mkdir(buildFolder);

            const tasks: ToolsTask[] = [];
            const context = {
                buildFolder: this._pathBuilder.resolve(this._rootFolder, buildFolder),
                workFolder: this._pathBuilder.resolve(this._rootFolder, workFolder),
                rootFolder: this._pathBuilder.resolve(this._rootFolder, '.')
            }
            
            for (let taskname in build.config.tasks) {
                const task = build.config.tasks[taskname];
                tasks.push(this._taskFactory.build({
                    context, 
                    task,
                    name: taskname
                }));
            }

            this._logger.info(id, `starting...`);

            for (let i in tasks) {
                await tasks[i].run((msg) => this._logger.info(id, msg));
            }
        } catch (e) {
            this._logger.info(id, e?.toString());
        }

        this._logger.info(id, `pipeline ${config.name} finished`);
    }

    private findFreeFolderName(folderDest: string) {
        let tmp: string = null;
        while (!tmp || this._ioFile.exist(`${folderDest}/${tmp}`)) {
            const date = new Date();
            const strDate = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getHours()}${date.getMinutes()}`;
            tmp = `${strDate}${Math.round(Math.random()*1000)}`;
        }
        return tmp;
    }
}