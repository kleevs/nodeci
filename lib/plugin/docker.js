"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var script_1 = require("./script");
function default_1(context, cmd, dockerfile) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = cmd;
                    switch (_a) {
                        case 'build': return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, build(context, dockerfile)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3: throw cmd + " not know";
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
function build(context, dockerfile) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var dockerfilename;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dockerfilename = "dockerfile_" + Math.round(Math.random() * 10000);
                    return [4 /*yield*/, script_1.default(context, "cp " + dockerfile + " " + context.workfolder + "/" + dockerfilename, "cat " + context.workfolder + "/" + dockerfilename)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
