"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamWritable = void 0;
var StreamWritable = /** @class */ (function () {
    function StreamWritable(_onCallback) {
        this._onCallback = _onCallback;
        this._stream = process.stdout;
        // this._stream.on("data", (data) => _onCallback(data));
        // this._stream.on("error", (data) => _onCallback(data));
        // this._stream._write = (chunk, enc: BufferEncoding, next: (error?: Error) => void) => {
        //     // our memory store stores things in buffers
        //     var buffer = (Buffer.isBuffer(chunk)) ?
        //       chunk :  // already is Buffer use it
        //       Buffer.from(chunk, enc);  // string, convert
        //     this._onCallback(buffer.toString());
        //     // concat to the buffer already there
        //     // this._buffer = Buffer.concat([this._buffer, buffer]);
        //     next();
        // }
    }
    StreamWritable.prototype.getStream = function () {
        return this._stream;
    };
    return StreamWritable;
}());
exports.StreamWritable = StreamWritable;
