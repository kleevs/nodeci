"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var script_1 = require("./script");
var path = require("path");
function default_1(context, _a) {
    var source = _a.source, destination = _a.destination;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var dest;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dest = destination || '.';
                    console.log("copy " + source + " to " + dest);
                    return [4 /*yield*/, script_1.default(context, [
                            "cp " + JSON.stringify(path.resolve(context.rootFolder, source)) + " " + JSON.stringify(path.resolve(context.workfolder, dest))
                        ])];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
