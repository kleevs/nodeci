"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendFile = exports.mkdirSync = exports.readSync = exports.writeSync = void 0;
var fs = require("fs");
function writeSync(filename, content) {
    fs.writeFileSync("" + filename, content, 'utf8');
}
exports.writeSync = writeSync;
function readSync(filename) {
    return fs.readFileSync("" + filename, 'utf8').toString();
}
exports.readSync = readSync;
function mkdirSync(dirname) {
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}
exports.mkdirSync = mkdirSync;
function appendFile(filename, content) {
    new Promise(function (resolve, reject) {
        if (!fs.existsSync(filename)) {
            fs.writeFile("" + filename, content, 'utf8', function (err) {
                if (err)
                    reject(err);
                resolve();
            });
        }
        else {
            fs.appendFile(filename, content, function (err) {
                if (err)
                    reject(err);
                resolve();
            });
        }
    });
}
exports.appendFile = appendFile;
