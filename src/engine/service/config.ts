import defaultConfig from '../../shared/config';

export function getConfig(config: Config): Config {
    return {
        port: config?.port || defaultConfig.port,
        socket: {
            pathname: config?.socket?.pathname || defaultConfig.socket.pathname
        },
        api: {
            pathname: config?.api?.pathname || defaultConfig.api.pathname,
        },
        pipeline: {
            ...defaultConfig.pipeline,
            ...config?.pipeline
        }
    }
}