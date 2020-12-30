"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
var tslib_1 = require("tslib");
var Agent = /** @class */ (function () {
    function Agent(_rootFolder, _name, _ioFile, _queue, _globalQueue, _pathBuilder, _logger, _taskFactory, _pinger) {
        this._rootFolder = _rootFolder;
        this._name = _name;
        this._ioFile = _ioFile;
        this._queue = _queue;
        this._globalQueue = _globalQueue;
        this._pathBuilder = _pathBuilder;
        this._logger = _logger;
        this._taskFactory = _taskFactory;
        this._pinger = _pinger;
        this._isBusy = false;
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
            var workContainer, id, workFolder, buildFolder, build, tasks, context, taskname, task, _a, _b, _i, i, e_1;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        workContainer = "./.nodeci/work";
                        id = this.findFreeFolderName(workContainer);
                        workFolder = this._pathBuilder.resolve(workContainer, id);
                        buildFolder = this._pathBuilder.resolve(workFolder, 'build');
                        this._pinger.start(config.name, this._name, id);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        this._logger.info(id, "pipeline " + config.name);
                        this._logger.info(id, "preparing...");
                        build = config;
                        this._ioFile.mkdir(buildFolder);
                        tasks = [];
                        context = {
                            buildFolder: this._pathBuilder.resolve(this._rootFolder, buildFolder),
                            workFolder: this._pathBuilder.resolve(this._rootFolder, workFolder),
                            rootFolder: this._pathBuilder.resolve(this._rootFolder, '.')
                        };
                        for (taskname in build.config.tasks) {
                            task = build.config.tasks[taskname];
                            tasks.push(this._taskFactory.build({
                                context: context,
                                task: task,
                                name: taskname
                            }));
                        }
                        this._logger.info(id, "starting...");
                        _a = [];
                        for (_b in tasks)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        i = _a[_i];
                        return [4 /*yield*/, tasks[i].run(function (msg) { return _this._logger.info(id, msg); })];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _c.sent();
                        this._logger.info(id, e_1 === null || e_1 === void 0 ? void 0 : e_1.toString());
                        return [3 /*break*/, 7];
                    case 7:
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
