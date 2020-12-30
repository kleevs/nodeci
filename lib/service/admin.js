"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
var tslib_1 = require("tslib");
var Admin = /** @class */ (function () {
    function Admin(_engine, _storage, _cryptoTools, _ioFile, _user) {
        this._engine = _engine;
        this._storage = _storage;
        this._cryptoTools = _cryptoTools;
        this._ioFile = _ioFile;
        this._user = _user;
    }
    Admin.prototype.listPipeline = function () {
        var storage = this._storage.get();
        var result = [];
        for (var pipeline in storage === null || storage === void 0 ? void 0 : storage.pipeline) {
            result.push(pipeline);
        }
        return result;
    };
    Admin.prototype.listBuild = function (pipelineName) {
        var result = [];
        var storage = this._storage.get();
        for (var id in storage === null || storage === void 0 ? void 0 : storage.logs[pipelineName]) {
            var log = storage === null || storage === void 0 ? void 0 : storage.logs[pipelineName][id];
            result.push({
                id: id,
                date: log.date,
                successfull: log.successfull,
                agent: log.agent
            });
        }
        return result;
    };
    Admin.prototype.getBuild = function (pipelineName, buildId) {
        var storage = this._storage.get();
        var log = storage === null || storage === void 0 ? void 0 : storage.logs[pipelineName][buildId];
        var result = this._ioFile.read("" + log.file);
        return result;
    };
    Admin.prototype.createPipeline = function (name, config) {
        this._engine.createPipeline({
            name: name,
            config: config
        });
    };
    Admin.prototype.createBuild = function (name, agent) {
        this._engine.createBuild({
            pipeline: name,
            agent: agent || null
        });
    };
    Admin.prototype.createUser = function (login, password) {
        var hash = this._cryptoTools.computeHash(login, password);
        this._user.update(function (users) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, users), (_a = {}, _a[login] = {
                password: hash
            }, _a)));
        });
    };
    return Admin;
}());
exports.Admin = Admin;
