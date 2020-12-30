"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
var tslib_1 = require("tslib");
var Storage = /** @class */ (function () {
    function Storage(data, _manager, _ioFile) {
        var _this = this;
        this._manager = _manager;
        this._ioFile = _ioFile;
        this._storage = {
            pipeline: {},
            logs: {}
        };
        this._ioFile.read(".nodeci/storage.data").then(function (str) {
            _this.updateStorage(function (storage) { return (tslib_1.__assign(tslib_1.__assign({}, storage), JSON.parse(str))); });
            _this.updateStorage(function (storage) { return (tslib_1.__assign(tslib_1.__assign({}, storage), { pipeline: tslib_1.__assign(tslib_1.__assign({}, storage.pipeline), data) })); });
        });
    }
    Storage.prototype.updateStorage = function (callback) {
        this._manager.fire(this._save(this._storage = callback(this._storage)));
    };
    Storage.prototype.onUpdateStorage = function (callback) {
        callback(this._storage);
        return this._manager.on(callback);
    };
    Storage.prototype.getStorage = function () {
        return tslib_1.__assign({}, this._storage);
    };
    Storage.prototype._save = function (storage) {
        var _this = this;
        (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ioFile.mkdir(".nodeci")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._ioFile.write(".nodeci/storage.data", JSON.stringify(storage))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); })();
        return storage;
    };
    return Storage;
}());
exports.Storage = Storage;
