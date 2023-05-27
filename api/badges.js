const redis = require('redis');
const cors = require('cors');
const { promisify } = require('util');

const corsMiddleware = cors();

module.exports = async (req, res) => {
  corsMiddleware(req, res);

  //Instantiate redis client
  const client = redis.createClient({url: process.env.REDIS_URI});

  client.on("error", function(error) {
    console.error("Redis client could not connect:", error);
    return res.status(500).json({ error: err.message });
  });

  //Connect to redis
  await client.connect();
  const badges = await client.lRange('ape', 0, -1);
  await client.disconnect();
  return res.json({ data: reply });
};
