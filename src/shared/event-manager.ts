export class EventManager<T> {
    private _listeners: ((v: T)=>void)[] = [];

    on(callback: (v: T) => void) {
        this._listeners.push(callback);
        return () => { this._listeners = this._listeners.filter(_ => _ !== callback) };
    }

    fire(v: T) {
        this._listeners.forEach(_ => _(v));
    }
}