"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var tslib_1 = require("tslib");
var User = /** @class */ (function () {
    function User(_manager, _ioFile) {
        var _this = this;
        this._manager = _manager;
        this._ioFile = _ioFile;
        this._users = {};
        this._ioFile.read(".nodeci/users.data").then(function (str) {
            _this.updateUser(function (user) { return (tslib_1.__assign(tslib_1.__assign({}, user), JSON.parse(str))); });
        });
    }
    User.prototype.updateUser = function (callback) {
        this._manager.fire(this._save(this._users = callback(this._users)));
    };
    User.prototype.onUpdateUser = function (callback) {
        callback(this._users);
        return this._manager.on(callback);
    };
    User.prototype.getUser = function () {
        return tslib_1.__assign({}, this._users);
    };
    User.prototype._save = function (user) {
        var _this = this;
        (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ioFile.mkdir(".nodeci")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._ioFile.write(".nodeci/users.data", JSON.stringify(user))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); })();
        return user;
    };
    return User;
}());
exports.User = User;
