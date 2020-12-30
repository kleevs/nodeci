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
                var pathfilename = this._pathBuilder.resolve('./', config.pipeline[name]);
                var str = this._ioFile.read(pathfilename);
                result[name] = JSON.parse(str);
            }
            catch (e) { }
        }
        return result;
    };
    return ConfigAccessor;
}());
exports.ConfigAccessor = ConfigAccessor;
