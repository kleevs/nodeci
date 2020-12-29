"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.onUpdateUsers = exports.updateUsers = void 0;
var tslib_1 = require("tslib");
var iofile_1 = require("../../shared/iofile");
var event_manager_1 = require("../../shared/event-manager");
var users = {};
var manager = new event_manager_1.EventManager();
function updateUsers(callback) {
    manager.fire(save(users = callback(users)));
}
exports.updateUsers = updateUsers;
function onUpdateUsers(callback) {
    callback(users);
    return manager.on(callback);
}
exports.onUpdateUsers = onUpdateUsers;
function getUsers() {
    return tslib_1.__assign({}, users);
}
exports.getUsers = getUsers;
function save(users) {
    iofile_1.mkdirSync(".nodeci");
    iofile_1.write(".nodeci/users.data", JSON.stringify(users));
    return users;
}
iofile_1.read(".nodeci/users.data").then(function (str) {
    updateUsers(function (users) { return (tslib_1.__assign(tslib_1.__assign({}, users), JSON.parse(str))); });
})
    .catch(function () { });
