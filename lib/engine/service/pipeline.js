"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReadOnlyPipeline = void 0;
var fs = require("fs");
var path = require("path");
function getReadOnlyPipeline(rootDir, config) {
    var result = [];
    var _loop_1 = function (name) {
        result.push(new Promise(function (resolve) {
            var pathfilename = path.resolve(rootDir, config.pipeline[name]);
            fs.readFile(pathfilename, 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                    resolve(null);
                }
                else {
                    console.log("pipeline " + pathfilename + " loaded");
                    resolve({ name: name, config: JSON.parse(data) });
                }
            });
        }));
    };
    for (var name in config.pipeline) {
        _loop_1(name);
    }
    return Promise.all(result).then(function (pipelines) { return pipelines.filter(function (_) { return !!_; }); });
}
exports.getReadOnlyPipeline = getReadOnlyPipeline;
