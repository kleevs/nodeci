export declare class Storage {
    private readonly _manager;
    private readonly _ioFile;
    private _storage;
    constructor(data: PipelineMetadata, _manager: ToolsEventManager<StorageData>, _ioFile: IOFileAsync);
    updateStorage(callback: (v: StorageData) => StorageData): void;
    onUpdateStorage(callback: (v: StorageData) => void): () => void;
    getStorage(): StorageData;
    private _save;
}
