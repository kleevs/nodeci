"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
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
