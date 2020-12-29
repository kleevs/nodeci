"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var tslib_1 = require("tslib");
var child_process_1 = require("child_process");
var path = require("path");
var iofile_1 = require("../../shared/iofile");
var Task = /** @class */ (function () {
    function Task(context, name, task) {
        this.context = context;
        this.name = name;
        iofile_1.writeSync(path.resolve(context.workfolder, name + ".js"), buildContentFile(context, task));
    }
    Task.prototype.run = function (log) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var child = child_process_1.spawn('powershell', ["node \"../" + _this.name + ".js\""], {
                            cwd: path.resolve(_this.context.workfolder, 'build')
                        });
                        child.stdout.on('data', function (data) { return log(data.toString()); });
                        child.stderr.on('data', function (data) { return log(data.toString()); });
                        child.on('close', function () {
                            resolve();
                        });
                    })];
            });
        });
    };
    return Task;
}());
exports.Task = Task;
var buildContentFile = function (context, task) { return "\n    const context = " + JSON.stringify({
    workfolder: context.workfolder + "/build",
    rootFolder: context.rootFolder
}) + ";\n    const variable = " + JSON.stringify(task.variable) + ";\n    const plugin = (() => {\n        try {\n            return require(\"../../../plugin/" + task.plugin + "\");\n        } catch (e) {\n            try {\n                return require(\"nodeci/lib/plugin/" + task.plugin + "\");\n            } catch (e) {\n                return require(\"../../../lib/plugin/" + task.plugin + "\");\n            }\n        }\n    })();\n    plugin.default(context, variable);\n"; };
