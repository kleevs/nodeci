"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
var EventManager = /** @class */ (function () {
    function EventManager() {
        this._listeners = [];
    }
    EventManager.prototype.on = function (callback) {
        var _this = this;
        this._listeners.push(callback);
        return function () { _this._listeners = _this._listeners.filter(function (_) { return _ !== callback; }); };
    };
    EventManager.prototype.fire = function (v) {
        this._listeners.forEach(function (_) { return _(v); });
    };
    return EventManager;
}());
exports.EventManager = EventManager;
