export class Agent implements EngineAgent {
    private _isBusy = false;

    constructor(
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

    run(config: Pipeline) {
        if (!this._isBusy) {
            this._isBusy = true;
            this.build(config);
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
        const workFolder = `./.nodeci/work`;
        const id = this.findFreeFolderName(workFolder);
        this._pinger.start(config.name, this._name, id);
        try {
            this._logger.info(id, `pipeline ${config.name}`);
            this._logger.info(id, `preparing...`);
            const build = config;
            this._ioFile.mkdir(this._pathBuilder.resolve(workFolder, id, 'build'));

            const tasks: ToolsTask[] = [];
            const context = {
                workFolder: workFolder
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

        this._logger.info(id, `pipeline ${config.name} finished`)
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