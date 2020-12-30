export class Storage {

    private _storage: StorageData = {
        pipeline: {},
        logs: {}
    }

    constructor(
        data: PipelineMetadata,
        private readonly _manager: ToolsEventManager<StorageData>,
        private readonly _ioFile: IOFileAsync
    ) {
        this._ioFile.read(`.nodeci/storage.data`).then((str) => {
            this.updateStorage(storage => ({
                ...storage,
                ...JSON.parse(str)
            }));
            this.updateStorage(storage => ({
                ...storage,
                pipeline: {
                    ...storage.pipeline,
                    ...data
                }
            }));
        })
    }

    updateStorage(callback: (v: StorageData) => StorageData) {
        this._manager.fire(this._save(this._storage = callback(this._storage)));
    }

    onUpdateStorage(callback: (v: StorageData) => void) {
        callback(this._storage);
        return this._manager.on(callback);
    }

    getStorage(): StorageData {
        return {...this._storage};
    }

    private _save(storage: StorageData) {
        (async () => {
            await this._ioFile.mkdir(`.nodeci`);
            await this._ioFile.write(`.nodeci/storage.data`, JSON.stringify(storage));
        })();
        
        return storage;
    } 
}