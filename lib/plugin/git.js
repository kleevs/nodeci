"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var script_1 = require("./script");
function default_1(context, _a) {
    var repository = _a.repository, commit = _a.commit, destination = _a.destination;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var dest;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dest = destination || 'git_src';
                    return [4 /*yield*/, script_1.default(context, [
                            "git clone " + repository + " " + dest + ";",
                            "cd ./" + dest + ";",
                            commit && "git checkout " + commit || ''
                        ])];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
