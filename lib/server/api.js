"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
function start(app, admin) {
    var routage = {
        pipelineList: "/pipeline",
        build: "/pipeline/:name",
        buildInstance: "/pipeline/:name/:id",
        user: "/user"
    };
    app.get(routage.pipelineList, function (req, res) {
        res.end(JSON.stringify(admin.listPipeline()));
    });
    app.put(routage.build, function (req, res) {
        admin.createPipeline(req.params.name, req.body);
        res.end();
    });
    app.get(routage.build, function (req, res) {
        res.end(JSON.stringify(admin.listBuild(req.params.name)));
    });
    app.post(routage.build, function (req, res) {
        var _a;
        admin.createBuild(req.params.name, ((_a = req.body) === null || _a === void 0 ? void 0 : _a.agent) || null);
        res.end();
    });
    app.get(routage.buildInstance, function (req, res) {
        res.end(admin.getBuild(req.params.name, req.params.id));
    });
    app.post(routage.user, function (req, res) {
        admin.createUser(req.body.login, req.body.password);
        res.end();
    });
}
exports.start = start;
