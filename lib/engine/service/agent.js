"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
var iofile_1 = require("../../shared/iofile");
var queue_1 = require("./queue");
var path = require("path");
var Agent = /** @class */ (function () {
    function Agent(_rootDir, _socket, _doWork) {
        var _this = this;
        this._rootDir = _rootDir;
        this._socket = _socket;
        this._doWork = _doWork;
        this._isBusy = false;
        this._queue = new queue_1.Queue();
        this._socket.on('finish', function () {
            if (!_this._queue.shift(function (config) {
                _this.build(config);
                return Promise.resolve(true);
            })) {
                _this._isBusy = false;
                _doWork(_this);
            }
        });
        this._socket.on('log', function (_a) {
            var id = _a.id, index = _a.index, message = _a.message;
            iofile_1.appendFile(path.resolve(_this._rootDir, "./.nodeci/logs/" + id + ".log.txt"), message + "\r\n");
            console.log(message);
        });
        _doWork(this);
    }
    Agent.prototype.isBusy = function () { return this._isBusy; };
    Agent.prototype.run = function (config) {
        if (!this._isBusy) {
            this._isBusy = true;
            this.build(config);
        }
        else {
            this._queue.push(config);
        }
    };
    Agent.prototype.doWork = function () {
        if (!this._isBusy) {
            this._doWork(this);
        }
    };
    Agent.prototype.build = function (config) {
        this._socket.emit('run', {
            config: config
        });
    };
    return Agent;
}());
exports.Agent = Agent;
