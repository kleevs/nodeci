import defaultConfig from '../../shared/config';

export function getConfig(config: Config): Config {
    return {
        socket: {
            port: config?.socket?.port || defaultConfig.socket.port
        },
        api: {
            port: config?.api?.port || defaultConfig.api.port,
        },
        pipeline: {
            ...defaultConfig.pipeline,
            ...config?.pipeline
        }
    }
}