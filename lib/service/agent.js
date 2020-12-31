"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
var tslib_1 = require("tslib");
var Agent = /** @class */ (function () {
    function Agent(_rootFolder, _name, _ioFile, _queue, _globalQueue, _pathBuilder, _logger, _runnerFactory, _pinger) {
        this._rootFolder = _rootFolder;
        this._name = _name;
        this._ioFile = _ioFile;
        this._queue = _queue;
        this._globalQueue = _globalQueue;
        this._pathBuilder = _pathBuilder;
        this._logger = _logger;
        this._runnerFactory = _runnerFactory;
        this._pinger = _pinger;
        this._isBusy = false;
    }
    Agent.prototype.isBusy = function () { return this._isBusy; };
    Agent.prototype.run = function (config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._isBusy) return [3 /*break*/, 2];
                        this._isBusy = true;
                        return [4 /*yield*/, this.build(config)];
                    case 1:
                        _a.sent();
                        if (!this._queue.shift(function (config) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.build(config)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, Promise.resolve(true)];
                                }
                            });
                        }); })) {
                            this._isBusy = false;
                            this.doWork();
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        this._queue.push(config);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agent.prototype.doWork = function () {
        var _this = this;
        this._globalQueue.shift(function (config) {
            if (!_this.isBusy()) {
                _this.run(config);
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        });
    };
    Agent.prototype.build = function (config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var workContainer, id, workFolder, buildFolder, build, runner, e_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workContainer = "./.nodeci/work";
                        id = this.findFreeFolderName(workContainer);
                        workFolder = this._pathBuilder.resolve(workContainer, id);
                        buildFolder = this._pathBuilder.resolve(workFolder, 'build');
                        this._pinger.start(config.name, this._name, id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this._logger.info(id, "pipeline " + config.name);
                        this._logger.info(id, "preparing...");
                        build = config;
                        this._ioFile.mkdir(buildFolder);
                        runner = this._runnerFactory.build({ buildFolder: buildFolder, context: config.config });
                        this._logger.info(id, "starting...");
                        return [4 /*yield*/, runner.run(function (msg) { return _this._logger.info(id, msg); })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this._logger.info(id, e_1 === null || e_1 === void 0 ? void 0 : e_1.toString());
                        return [3 /*break*/, 4];
                    case 4:
                        this._logger.info(id, "pipeline " + config.name + " finished");
                        return [2 /*return*/];
                }
            });
        });
    };
    Agent.prototype.findFreeFolderName = function (folderDest) {
        var tmp = null;
        while (!tmp || this._ioFile.exist(folderDest + "/" + tmp)) {
            var date = new Date();
            var strDate = "" + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes();
            tmp = "" + strDate + Math.round(Math.random() * 1000);
        }
        return tmp;
    };
    return Agent;
}());
exports.Agent = Agent;
