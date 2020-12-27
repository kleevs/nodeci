"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var script_1 = require("./script");
function default_1(context, repo, commit) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, script_1.default(context, "cd " + context.workfolder, "git clone " + repo + " git_src;", "cd ./git_src;", "git checkout " + commit)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
