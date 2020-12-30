import { Express } from 'express';

export function start(app: Express, admin: AdminInterface) {
    const routage = {
        pipelineList: `/pipeline`,
        build: `/pipeline/:name`,
        buildInstance: `/pipeline/:name/:id`,
        user: `/user`
    };

    app.get(routage.pipelineList, (req, res) => {
        res.end(JSON.stringify(admin.listPipeline()));
    });

    app.put(routage.build, (req, res) => {
        admin.createPipeline(req.params.name, req.body);
        res.end();
    });

    app.get(routage.build, (req, res) => {
        res.end(JSON.stringify(admin.listBuild(req.params.name)));
    });

    app.post(routage.build, (req, res) => {
        admin.createBuild(req.params.name, req.body?.agent || null);
        res.end();
    });

    app.get(routage.buildInstance, (req, res) => {
        res.end(admin.getBuild(req.params.name, req.params.id));
    });

    app.post(routage.user, (req, res) => {
        admin.createUser(req.body.login, req.body.password);
        res.end();
    })
}