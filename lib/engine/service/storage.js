"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readLogMetadata = exports.writeLogMetadata = exports.appendLog = exports.read = exports.write = void 0;
var fs = require("fs");
var iofile_1 = require("../../shared/iofile");
var pathStorage = '.nodeci/storage';
function write(pipeline) {
    if (!fs.existsSync(pathStorage)) {
        fs.mkdirSync(pathStorage, { recursive: true });
    }
    fs.writeFile(pathStorage + "/.pipeline", JSON.stringify(pipeline), 'utf8', function (err) {
        if (err)
            return console.log(err);
    });
}
exports.write = write;
function read() {
    return new Promise(function (resolve, reject) {
        if (fs.existsSync(pathStorage)) {
            fs.readFile(pathStorage + "/.pipeline", 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                    reject();
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        }
        else {
            resolve({});
        }
    });
}
exports.read = read;
function appendLog(_a) {
    var id = _a.id, message = _a.message;
    iofile_1.appendFile(".nodeci/logs/" + id + ".log.txt", message + "\r\n");
}
exports.appendLog = appendLog;
function writeLogMetadata(metadata) {
    if (!fs.existsSync(pathStorage)) {
        fs.mkdirSync(pathStorage, { recursive: true });
    }
    fs.writeFile(pathStorage + "/.log", JSON.stringify(metadata), 'utf8', function (err) {
        if (err)
            return console.log(err);
    });
}
exports.writeLogMetadata = writeLogMetadata;
function readLogMetadata() {
    return new Promise(function (resolve, reject) {
        if (fs.existsSync(pathStorage)) {
            fs.readFile(pathStorage + "/.log", 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                    reject();
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        }
        else {
            resolve({});
        }
    });
}
exports.readLogMetadata = readLogMetadata;
