//Initialize Redis either with heroku if .env included or local redis
const db = require('redis').createClient(process.env.REDIS_URL);

db.on('error', function(err) {
  console.log('ERROR' + err);
});

module.exports = db;