"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var tslib_1 = require("tslib");
var express = require("express");
var bodyParser = require("body-parser");
var iofile_1 = require("../../shared/iofile");
var authorization_1 = require("./authorization");
var storage_1 = require("./storage");
function start(config, socketserver) {
    var routage = {
        pipelineList: "/pipeline",
        build: "/pipeline/:name",
        buildInstance: "/pipeline/:name/:id",
        user: "/user"
    };
    var port = config.port;
    var app = express();
    var io = require('socket.io-client');
    var socket = io(socketserver);
    var data = {
        storage: null
    };
    socket.on('storage', function (storage) {
        data.storage = storage;
    });
    app.use(authorization_1.basicAuth(storage_1.getUsers));
    app.use(bodyParser.json());
    //app.use(proxy(config, socketserver))
    app.get(routage.pipelineList, function (req, res) {
        var _a;
        var result = [];
        for (var pipeline in (_a = data.storage) === null || _a === void 0 ? void 0 : _a.pipeline) {
            result.push(pipeline);
        }
        res.end(JSON.stringify(result));
    });
    app.put(routage.build, function (req, res) {
        socket.emit('create-build', {
            name: req.params.name,
            config: req.body
        });
        res.end();
    });
    app.get(routage.build, function (req, res) {
        var _a, _b;
        var result = [];
        for (var id in (_a = data.storage) === null || _a === void 0 ? void 0 : _a.logs[req.params.name]) {
            var log = (_b = data.storage) === null || _b === void 0 ? void 0 : _b.logs[req.params.name][id];
            result.push({
                id: id,
                date: log.date,
                successfull: log.successfull,
                agent: log.agent
            });
        }
        res.end(JSON.stringify(result));
    });
    app.post(routage.build, function (req, res) {
        var _a;
        socket.emit('launch-build', {
            pipeline: req.params.name,
            agent: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.agent) || null
        });
        res.end();
    });
    app.get(routage.buildInstance, function (req, res) {
        var _a;
        var log = (_a = data.storage) === null || _a === void 0 ? void 0 : _a.logs[req.params.name][req.params.id];
        var result = iofile_1.readSync("" + log.file);
        res.end(result);
    });
    app.post(routage.user, function (req, res) {
        var password = authorization_1.computeHash(authorization_1.toBasicAuth(req.body.login, req.body.password));
        storage_1.updateUsers(function (users) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, users), (_a = {}, _a[req.body.login] = {
                password: password
            }, _a)));
        });
        res.end();
    });
    app.listen(port, function () {
        console.log("listening at http://localhost:" + port);
        socket.emit('admin');
    });
}
exports.start = start;
