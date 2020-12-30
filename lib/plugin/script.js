"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
var tslib_1 = require("tslib");
var child_process_1 = require("child_process");
var process = require("process");
function execute(command, log) {
    return new Promise(function (resolve) {
        var stdout = process.stdout;
        var stderr = process.stderr;
        if (!/^win/.test(process.platform)) { // linux
            var child = child_process_1.spawn(command, [], {
                stdio: [null, stdout, stderr]
            });
            child.on("close", function () { return resolve(); });
        }
        else { // windows
            var child_1 = child_process_1.spawn('powershell', [command], {
                stdio: [null, stdout, stderr]
            });
            child_1.on("close", function () { return resolve(); });
            child_1.on("message", function (msg) { return log(msg === null || msg === void 0 ? void 0 : msg.toString()); });
        }
    });
}
exports.execute = execute;
function default_1(context, commands) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, execute(commands === null || commands === void 0 ? void 0 : commands.join(";"))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
