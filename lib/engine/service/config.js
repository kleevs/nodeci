"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
var tslib_1 = require("tslib");
var config_1 = require("../../shared/config");
function getConfig(config) {
    var _a, _b;
    return {
        port: (config === null || config === void 0 ? void 0 : config.port) || config_1.default.port,
        socket: {
            pathname: ((_a = config === null || config === void 0 ? void 0 : config.socket) === null || _a === void 0 ? void 0 : _a.pathname) || config_1.default.socket.pathname
        },
        api: {
            pathname: ((_b = config === null || config === void 0 ? void 0 : config.api) === null || _b === void 0 ? void 0 : _b.pathname) || config_1.default.api.pathname,
        },
        pipeline: tslib_1.__assign(tslib_1.__assign({}, config_1.default.pipeline), config === null || config === void 0 ? void 0 : config.pipeline)
    };
}
exports.getConfig = getConfig;
