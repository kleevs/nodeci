export declare class User {
    private readonly _manager;
    private readonly _ioFile;
    private _users;
    constructor(_manager: ToolsEventManager<UsersData>, _ioFile: IOFileAsync);
    updateUser(callback: (v: UsersData) => UsersData): void;
    onUpdateUser(callback: (v: UsersData) => void): () => void;
    getUser(): UsersData;
    private _save;
}
