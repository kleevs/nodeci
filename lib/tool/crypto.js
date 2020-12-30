"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = void 0;
var crypto_1 = require("crypto");
var Crypto = /** @class */ (function () {
    function Crypto() {
    }
    Crypto.prototype.computeHash = function (login, password) {
        return crypto_1.createHash('sha256').update(Buffer.from(login + ":" + password, 'utf8').toString('base64')).digest('base64');
    };
    return Crypto;
}());
exports.Crypto = Crypto;
