type Build = {
    pipeline: string;
    agent: string;
}

export class Queue<T> {
    private readonly _queue: T[] = [];

    constructor () {}

    push(build: T) {
        this._queue.push(build);
    }

    shift(callback: (v: T)=>Promise<boolean>) {
        if (this._queue.length > 0) {
            const build = this._queue.shift();
            callback(build).then(_ => {
                if (!_) { throw ''; }
            }).catch(() => {
                this.push(build);
            });
            return true;
        }
        return false;
    } 
}