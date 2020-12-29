"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorage = exports.onUpdateStorage = exports.updateStorage = void 0;
var tslib_1 = require("tslib");
var iofile_1 = require("../../shared/iofile");
var event_manager_1 = require("../../shared/event-manager");
var storage = {
    pipeline: {},
    logs: {}
};
var manager = new event_manager_1.EventManager();
function updateStorage(callback) {
    manager.fire(save(storage = callback(storage)));
}
exports.updateStorage = updateStorage;
function onUpdateStorage(callback) {
    callback(storage);
    return manager.on(callback);
}
exports.onUpdateStorage = onUpdateStorage;
function getStorage() {
    return tslib_1.__assign({}, storage);
}
exports.getStorage = getStorage;
function save(storage) {
    iofile_1.mkdirSync(".nodeci");
    iofile_1.write(".nodeci/storage.data", JSON.stringify(storage));
    return storage;
}
iofile_1.read(".nodeci/storage.data").then(function (str) {
    updateStorage(function (storage) { return (tslib_1.__assign(tslib_1.__assign({}, storage), JSON.parse(str))); });
})
    .catch(function () { });
