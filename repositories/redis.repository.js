const redis = require("redis");
require("dotenv").config();

class RedisClientRepository {
    constructor() {
        this.redisClient = redis.createClient({
            url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
            legacyMode: true,
        });

        this.redisConnected = false;
    }

    initialize = async () => {
        this.redisClient.on("connect", () => {
            this.redisConnected = true;
            console.info("redis is connected");
        });
        this.redisClient.on("error", (err) => {
            console.error("redis error" + err);
        });
        if (!this.redisConnected) this.redisClient.connect().then();
    };

    setRefreshToken = async (refreshToken, { userId, nickname }) => {
        await this.initialize();
        const value = JSON.stringify({ userId, nickname });
        await this.redisClient.v4.set(refreshToken, value);
    };

    getRefreshToken = async (refreshToken) => {
        await this.initialize();
        console.log("trying to get" + refreshToken);
        await this.redisClient.v4.get(refreshToken);
        return token;
    };
    deleteRefreshToken = async (refreshToken) => {
        await this.initialize();
        await this.redisClient.v4.del(refreshToken);
    };
}
module.exports = RedisClientRepository;
