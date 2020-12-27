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
        var directory, workpath, context, _a, _b, _i, name, task, variable, e_1;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
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
                    _a = [];
                    for (_b in build.config.tasks)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    name = _a[_i];
                    task = build.config.tasks[name];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    variable = [context].concat(task.variable);
                    return [4 /*yield*/, require("../../plugin/" + task.plugin).default.apply(this, variable)];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _c.sent();
                    console.error('error task', e_1);
                    return [3 /*break*/, 6];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    setTimeout(function () {
                        socket.emit('finish');
                    }, 5000);
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
