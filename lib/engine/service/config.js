"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
var tslib_1 = require("tslib");
var config_1 = require("../../shared/config");
function getConfig(config) {
    var _a, _b, _c;
    return {
        socket: {
            port: ((_a = config === null || config === void 0 ? void 0 : config.socket) === null || _a === void 0 ? void 0 : _a.port) || config_1.default.socket.port,
            pipeline: tslib_1.__assign(tslib_1.__assign({}, config_1.default.socket.pipeline), (_b = config === null || config === void 0 ? void 0 : config.socket) === null || _b === void 0 ? void 0 : _b.pipeline)
        },
        api: {
            port: ((_c = config === null || config === void 0 ? void 0 : config.api) === null || _c === void 0 ? void 0 : _c.port) || config_1.default.api.port,
        }
    };
}
exports.getConfig = getConfig;
