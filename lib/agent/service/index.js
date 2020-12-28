"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var tslib_1 = require("tslib");
var fs = require("fs");
var path = require("path");
function start(host, name, currentPath) {
    var _this = this;
    var io = require('socket.io-client');
    var socket = io(host);
    var rootDir = currentPath.replace(/\\/gi, '/');
    socket.on('connect', function () {
        console.log("is connected as " + socket.id);
        socket.emit('agent', { name: name });
    });
    socket.on('run', function (build) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var directory, workpath, context, _loop_1, _a, _b, _i, name, state_1, e_1;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("start pipeline " + name);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    directory = (function () {
                        var tmp = null;
                        while (!tmp || fs.existsSync(tmp)) {
                            var date = new Date();
                            var strDate = "" + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes();
                            tmp = "./.nodeci/work/" + strDate + Math.round(Math.random() * 1000);
                        }
                        return tmp;
                    })();
                    workpath = path.resolve(rootDir, directory);
                    fs.mkdirSync(directory, { recursive: true });
                    context = {
                        workfolder: workpath
                    };
                    _loop_1 = function () {
                        var task, variable, plugin, e_2;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    task = build.config.tasks[name];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    variable = task.variable;
                                    plugin = (function () {
                                        try {
                                            return require(path.resolve(rootDir, "plugin/" + task.plugin));
                                        }
                                        catch (e) {
                                            return require("../../plugin/" + task.plugin);
                                        }
                                    })();
                                    return [4 /*yield*/, plugin.default(context, variable)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_2 = _a.sent();
                                    console.error('error task', e_2);
                                    return [2 /*return*/, "break"];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _a = [];
                    for (_b in build.config.tasks)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    name = _a[_i];
                    return [5 /*yield**/, _loop_1()];
                case 3:
                    state_1 = _c.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 5];
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _c.sent();
                    console.log(e_1);
                    return [3 /*break*/, 7];
                case 7:
                    console.log("pipeline " + name + " finished");
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
