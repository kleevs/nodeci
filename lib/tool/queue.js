"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
var Queue = /** @class */ (function () {
    function Queue() {
        this._queue = [];
    }
    Queue.prototype.push = function (build) {
        this._queue.push(build);
    };
    Queue.prototype.shift = function (callback) {
        var _this = this;
        if (this._queue.length > 0) {
            var build_1 = this._queue.shift();
            callback(build_1).then(function (_) {
                if (!_) {
                    throw '';
                }
            }).catch(function () {
                _this.push(build_1);
            });
            return true;
        }
        return false;
    };
    return Queue;
}());
exports.Queue = Queue;
