"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentType = void 0;
function contentType() {
    return function (req, res, next) {
        res.setHeader('content-type', 'text/json');
        next();
    };
}
exports.contentType = contentType;
