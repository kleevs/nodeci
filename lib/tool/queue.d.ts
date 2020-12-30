export declare class Queue<T> {
    private readonly _queue;
    constructor();
    push(build: T): void;
    shift(callback: (v: T) => Promise<boolean>): boolean;
}
