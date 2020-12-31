"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
var tslib_1 = require("tslib");
var child_process_1 = require("child_process");
var Runner = /** @class */ (function () {
    function Runner(_buildFolder, _config, _pathBuilder) {
        this._buildFolder = _buildFolder;
        this._config = _config;
        this._pathBuilder = _pathBuilder;
        child_process_1.spawnSync('powershell', ["cp -r \"" + this._config.path + "/*\" \"" + _buildFolder + "\""]);
    }
    Runner.prototype.run = function (log) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var child = child_process_1.spawn('powershell', ["node \"" + _this._config.entry + "\""], {
                            cwd: _this._pathBuilder.resolve(_this._buildFolder)
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
    return Runner;
}());
exports.Runner = Runner;
