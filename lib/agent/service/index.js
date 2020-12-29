"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var tslib_1 = require("tslib");
var folder_1 = require("./folder");
var task_1 = require("./task");
function start(host, name, currentPath) {
    var _this = this;
    var io = require('socket.io-client');
    var socket = io(host);
    var rootDir = currentPath.replace(/\\/gi, '/');
    var lognumber = { length: 0 };
    var logger = function (id, msg) {
        lognumber.length++;
        socket.emit('log', { id: id, index: lognumber.length, message: (msg === null || msg === void 0 ? void 0 : msg.replace(/\r?\n$/gi, '').replace(/^\r?\n/gi, '')) || '' });
    };
    socket.on('connect', function () {
        console.log("is connected as " + socket.id);
        socket.emit('agent', { name: name });
    });
    socket.on('run', function (build) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, workingFolderAbsolutePath, id, log, tasks, context, taskname, task, _b, _c, _i, i, e_1;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = folder_1.createWorkingFolder(rootDir), workingFolderAbsolutePath = _a.workingFolderAbsolutePath, id = _a.id;
                    log = function (msg) { return (msg === null || msg === void 0 ? void 0 : msg.toString()) && logger(id, msg.toString()); };
                    log("pipeline " + name);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, , 7]);
                    log("preparing...");
                    tasks = [];
                    context = {
                        workfolder: workingFolderAbsolutePath,
                        rootFolder: rootDir
                    };
                    for (taskname in build.config.tasks) {
                        task = build.config.tasks[taskname];
                        tasks.push(new task_1.Task(context, taskname, task));
                    }
                    log("starting...");
                    _b = [];
                    for (_c in tasks)
                        _b.push(_c);
                    _i = 0;
                    _d.label = 2;
                case 2:
                    if (!(_i < _b.length)) return [3 /*break*/, 5];
                    i = _b[_i];
                    return [4 /*yield*/, tasks[i].run(log)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _d.sent();
                    log(e_1);
                    log(e_1);
                    return [3 /*break*/, 7];
                case 7:
                    log("pipeline " + name + " finished");
                    socket.emit('finish');
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on('disconnect', function () {
        console.log('diconnect');
    });
    console.log("start agent");
}
exports.start = start;
