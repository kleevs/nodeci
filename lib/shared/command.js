"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
var child_process_1 = require("child_process");
var process = require('process');
function execute(command) {
    return new Promise(function (resolve, reject) {
        if (!/^win/.test(process.platform)) { // linux
            var child = child_process_1.spawn(command, [], {
                stdio: [null, process.stdout, process.stderr]
            });
            child.on("close", function () { return resolve(); });
        }
        else { // windows
            var child_1 = child_process_1.spawn('powershell', [command], {
                stdio: [null, process.stdout, process.stderr]
            });
            child_1.on("close", function () { return resolve(); });
        }
    });
}
exports.execute = execute;
