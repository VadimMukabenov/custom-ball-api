import { createClient } from 'redis';
import type { RedisClientType, RedisClientOptions } from 'redis';

class RedisClientService {
    private readonly redisClient: RedisClientType;
    constructor(config?: RedisClientOptions) {
        this.redisClient = getRedisClient(config);
    }

    async connect() {
        return this.redisClient.connect();
    }

    async disconnect() {
        await this.redisClient.disconnect();
    }
}

function getRedisClient (config: RedisClientOptions): RedisClientType {
    // redis[s]://[[username][:password]@][host][:port][/db-number]
    // 'redis://alice:foobared@awesome.redis.server:6380'
    const client: RedisClientType = createClient({
        // by default, connects to localhost:6379
        // url: `redis://${username}:${password}@${host}:${dbname}`,
    });

    client.on('error', err => console.log('Redis Client Error', err));

    return client;
};

export default RedisClientService;