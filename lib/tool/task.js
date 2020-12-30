"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var tslib_1 = require("tslib");
var child_process_1 = require("child_process");
var Task = /** @class */ (function () {
    function Task(_iofile, _pathBuilder, _context, _name, _task) {
        this._pathBuilder = _pathBuilder;
        this._context = _context;
        this._name = _name;
        _iofile.write(this._pathBuilder.resolve(_context.workFolder, _name + ".js"), this._buildContentFile(_context, _task));
    }
    Task.prototype.run = function (log) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var child = child_process_1.spawn('powershell', ["node \"../" + _this._name + ".js\""], {
                            cwd: _this._pathBuilder.resolve(_this._context.workFolder, 'build')
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
    Task.prototype._buildContentFile = function (context, task) {
        return "\n    const context = " + JSON.stringify({
            workFolder: context.workFolder + "/build"
        }) + ";\n    const variable = " + JSON.stringify(task.variable) + ";\n    const plugin = (() => {\n        try {\n            return require(\"../../../plugin/" + task.plugin + "\");\n        } catch (e) {\n            try {\n                return require(\"nodeci/lib/plugin/" + task.plugin + "\");\n            } catch (e) {\n                return require(\"../../../lib/plugin/" + task.plugin + "\");\n            }\n        }\n    })();\n    plugin.default(context, variable);\n";
    };
    return Task;
}());
exports.Task = Task;
