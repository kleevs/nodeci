import { createProxyMiddleware } from 'http-proxy-middleware';

export function proxy(config: Config, socketHost: string) {
    const apiPath = `${config.api.pathname}`;
    const socketPath = `${config.socket.pathname}`;

    return createProxyMiddleware({ 
        target: `http://localhost:${config.port}`, 
        changeOrigin: true, 
        ws: true,
        pathRewrite: {
            [apiPath]: '/'
        },
        router: {
            [socketPath]: socketHost
        }
    });
}