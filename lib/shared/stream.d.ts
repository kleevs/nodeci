/// <reference types="node" />
export declare class StreamWritable {
    readonly _onCallback: (data: string) => void;
    private readonly _stream;
    constructor(_onCallback: (data: string) => void);
    getStream(): NodeJS.WriteStream;
}
