"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxy = void 0;
var http_proxy_middleware_1 = require("http-proxy-middleware");
function proxy(config, socketHost) {
    var _a, _b;
    var apiPath = "" + config.api.pathname;
    var socketPath = "" + config.socket.pathname;
    return http_proxy_middleware_1.createProxyMiddleware({
        target: "http://localhost:" + config.port,
        changeOrigin: true,
        ws: true,
        pathRewrite: (_a = {},
            _a[apiPath] = '/',
            _a),
        router: (_b = {},
            _b[socketPath] = socketHost,
            _b)
    });
}
exports.proxy = proxy;
