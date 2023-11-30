import type { Config } from "../config";
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

export const getRedisClient = async (config: Config): Promise<RedisClientType> => {
    // redis[s]://[[username][:password]@][host][:port][/db-number]
    // 'redis://alice:foobared@awesome.redis.server:6380'
    const client: RedisClientType = createClient({
        // by default, connects to localhost:6379
        // url: `redis://${username}:${password}@${host}:${dbname}`,
    });

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    return client;
};