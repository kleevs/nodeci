"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
var tslib_1 = require("tslib");
var Engine = /** @class */ (function () {
    function Engine(_storage, _agents, _queue) {
        this._storage = _storage;
        this._agents = _agents;
        this._queue = _queue;
    }
    Engine.prototype.createPipeline = function (config) {
        this._storage.update(function (storage) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, storage), { pipeline: tslib_1.__assign(tslib_1.__assign({}, storage.pipeline), (_a = {}, _a[config.name] = config.config, _a)) }));
        });
    };
    Engine.prototype.createBuild = function (build) {
        var _a;
        var config = (_a = this._storage.get()) === null || _a === void 0 ? void 0 : _a.pipeline[build.pipeline];
        var agentName = build.agent;
        var metadata = { config: config, name: build.pipeline };
        var agentNames = this._agents;
        if (agentName && agentNames[agentName]) {
            agentNames[agentName].run(metadata);
        }
        else {
            this._queue.push(metadata);
            for (var name in agentNames) {
                if (!agentNames[name].isBusy()) {
                    agentNames[name].doWork();
                }
            }
        }
    };
    return Engine;
}());
exports.Engine = Engine;
