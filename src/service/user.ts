export class User {

    private _users: UsersData = {
    }

    constructor(
        private readonly _manager: ToolsEventManager<UsersData>,
        private readonly _ioFile: IOFileAsync
    ) {
        this._ioFile.read(`.nodeci/users.data`).then((str) => {
            this.updateUser(user => ({
                ...user,
                ...JSON.parse(str)
            }));
        })
    }

    updateUser(callback: (v: UsersData) => UsersData) {
        this._manager.fire(this._save(this._users = callback(this._users)));
    }

    onUpdateUser(callback: (v: UsersData) => void) {
        callback(this._users);
        return this._manager.on(callback);
    }

    getUser(): UsersData {
        return {...this._users};
    }

    private _save(user: UsersData) {
        (async () => {
            await this._ioFile.mkdir(`.nodeci`);
            await this._ioFile.write(`.nodeci/users.data`, JSON.stringify(user));
        })();
        
        return user;
    } 
}