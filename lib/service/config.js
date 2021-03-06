"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigAccessor = void 0;
var ConfigAccessor = /** @class */ (function () {
    function ConfigAccessor(_pathBuilder, _ioFile) {
        this._pathBuilder = _pathBuilder;
        this._ioFile = _ioFile;
    }
    ConfigAccessor.prototype.getConfig = function (config) {
        var result = {};
        for (var name in config.pipeline) {
            try {
                if (typeof config.pipeline[name] === "string") {
                    result[name] = {
                        path: config.pipeline[name],
                        entry: 'index.js',
                        cmd: 'node'
                    };
                }
                else {
                    var info = config.pipeline[name];
                    result[name] = {
                        path: (info === null || info === void 0 ? void 0 : info.path) || '.',
                        entry: (info === null || info === void 0 ? void 0 : info.entry) || 'index.js',
                        cmd: (info === null || info === void 0 ? void 0 : info.cmd) || 'node'
                    };
                }
            }
            catch (e) { }
        }
        return result;
    };
    return ConfigAccessor;
}());
exports.ConfigAccessor = ConfigAccessor;
