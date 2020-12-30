"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOFileAsync = exports.IOFileSync = void 0;
var fs = require("fs");
var IOFileSync = /** @class */ (function () {
    function IOFileSync() {
    }
    IOFileSync.prototype.write = function (filename, content) {
        fs.writeFileSync("" + filename, content, 'utf8');
    };
    IOFileSync.prototype.read = function (filename) {
        if (fs.existsSync(filename)) {
            return fs.readFileSync("" + filename, 'utf8').toString();
        }
        return null;
    };
    IOFileSync.prototype.mkdir = function (dirname) {
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }
    };
    IOFileSync.prototype.exist = function (dirname) {
        return fs.existsSync(dirname);
    };
    return IOFileSync;
}());
exports.IOFileSync = IOFileSync;
var IOFileAsync = /** @class */ (function () {
    function IOFileAsync() {
    }
    IOFileAsync.prototype.write = function (filename, content) {
        return new Promise(function (resolve, reject) { return fs.writeFile("" + filename, content, 'utf8', function (err) {
            if (err)
                reject(err);
            resolve();
        }); });
    };
    IOFileAsync.prototype.read = function (filename) {
        return new Promise(function (resolve, reject) {
            if (fs.existsSync(filename)) {
                fs.readFile("" + filename, 'utf8', function (err, data) {
                    if (err)
                        reject(err);
                    resolve(data);
                });
            }
            else {
                resolve(null);
            }
        });
    };
    IOFileAsync.prototype.mkdir = function (dirname) {
        return new Promise(function (resolve, reject) {
            if (!fs.existsSync(dirname)) {
                fs.mkdir(dirname, { recursive: true }, function (err) {
                    if (err)
                        reject(err);
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    };
    IOFileAsync.prototype.exist = function (dirname) {
        return new Promise(function (resolve) {
            fs.access(dirname, function (err) {
                if (err) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    };
    IOFileAsync.prototype.appendFile = function (filename, content) {
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
    };
    return IOFileAsync;
}());
exports.IOFileAsync = IOFileAsync;
