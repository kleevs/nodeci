"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var command_1 = require("../shared/command");
function default_1(context) {
    var commands = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        commands[_i - 1] = arguments[_i];
    }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, command_1.execute(commands === null || commands === void 0 ? void 0 : commands.join(";"))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
