"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeHash = exports.toBasicAuth = exports.basicAuth = void 0;
var crypto_1 = require("crypto");
function basicAuth(getUsers) {
    return function (req, res, next) {
        var _a, _b, _c;
        var authorization = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(';').filter(function (_) { return _.startsWith('Basic '); })[0];
        var _d = (authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')) || [], basicAuthorization = _d[1];
        var users = getUsers();
        if (req.originalUrl === '/user' && (!users || Object.keys(users).length === 0)) {
            next();
            return;
        }
        if (basicAuthorization) {
            var buff = Buffer.from(basicAuthorization, 'base64');
            var login = buff.toString('utf8').split(':')[0];
            var hash = computeHash(basicAuthorization);
            if (((_c = users[login]) === null || _c === void 0 ? void 0 : _c.password) === hash) {
                next();
                return;
            }
        }
        res.status(401);
        res.end();
    };
}
exports.basicAuth = basicAuth;
function toBasicAuth(login, password) {
    return Buffer.from(login + ":" + password, 'utf8').toString('base64');
}
exports.toBasicAuth = toBasicAuth;
function computeHash(authorization) {
    return crypto_1.createHash('sha256').update(authorization).digest('base64');
}
exports.computeHash = computeHash;
