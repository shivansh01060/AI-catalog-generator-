const https = require("https");

const keepAlive = () => {
  const url = process.env.RENDER_URL;
  if (!url) return;

  setInterval(
    () => {
      https
        .get(url, (res) => {
          console.log(`Keep-alive ping: ${res.statusCode}`);
        })
        .on("error", (err) => {
          console.log(`Keep-alive error: ${err.message}`);
        });
    },
    14 * 60 * 1000,
  ); // ping every 14 minutes
};

module.exports = keepAlive;
