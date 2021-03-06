"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var script_1 = require("./script");
var pathlib = require("path");
var copy_1 = require("./copy");
function default_1(context, _a) {
    var cmd = _a.cmd, dockerfile = _a.dockerfile, path = _a.path, tag = _a.tag;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = cmd;
                    switch (_b) {
                        case 'build': return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, build(context, dockerfile, tag, path || '.')];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3: throw cmd + " not know";
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
function build(context, dockerfile, tag, path) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var dockerfilename, dockerpath, pathname, tagname;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dockerfilename = dockerfile && "dockerfile_" + Math.round(Math.random() * 10000) || 'Dockerfile';
                    dockerpath = pathlib.resolve(context.workFolder, dockerfilename);
                    pathname = pathlib.resolve(context.workFolder, path || '.');
                    tagname = tag === null || tag === void 0 ? void 0 : tag.split(/\s+/)[0];
                    if (!dockerfile) return [3 /*break*/, 2];
                    return [4 /*yield*/, copy_1.default(context, { source: dockerfile, destination: dockerpath })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, script_1.default(context, [
                        "docker build -f " + dockerpath + " " + (tagname && "-t " + tagname) + " " + pathname
                    ])];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
