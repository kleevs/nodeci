"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = exports.write = void 0;
var fs = require("fs");
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
