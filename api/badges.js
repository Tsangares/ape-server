const redis = require('redis');
const cors = require('cors');
const { promisify } = require('util');

const corsMiddleware = cors();

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  const client = redis.createClient(process.env.REDIS_URI);
  const llrangeAsync = promisify(client.llrange).bind(client);

  client.on("error", function(error) {
    console.error("Redis client could not connect:", error);
  });

  try {
    const reply = await llrangeAsync('ape', 0, -1);
    return res.json({ data: reply });
  } catch(err) {
    return res.status(500).json({ error: err.message });
  } finally {
    client.quit();
  }
};
