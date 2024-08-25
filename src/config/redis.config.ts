export default () => ({
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    password: process.env.REDIS_PASSWORD,
    max: parseInt(process.env.REDIS_MAX_CONNECTIONS, 10) || 100,
    ttl: parseInt(process.env.REDIS_TTL, 10) || 0,
  },
});
