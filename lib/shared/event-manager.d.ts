export declare class EventManager<T> {
    private _listeners;
    on(callback: (v: T) => void): () => void;
    fire(v: T): void;
}
