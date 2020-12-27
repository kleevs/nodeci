"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReadOnlyPipeline = void 0;
var fs = require("fs");
function getReadOnlyPipeline(config) {
    return new Promise(function (resolve) {
        var result = [];
        for (var name in config.socket.pipeline) {
            config.socket.pipeline[name];
            fs.readFile("" + config.socket.pipeline[name], 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    result.push(JSON.parse(data));
                }
            });
        }
        resolve(result);
    });
}
exports.getReadOnlyPipeline = getReadOnlyPipeline;
