import defaultConfig from '../../shared/config';

export function getConfig(config: Config): Config {
    return {
        socket: {
            port: config?.socket?.port || defaultConfig.socket.port,
            pipeline: {
                ...defaultConfig.socket.pipeline,
                ...config?.socket?.pipeline
            }
        },
        api: {
            port: config?.api?.port || defaultConfig.api.port,
        }
    }
}