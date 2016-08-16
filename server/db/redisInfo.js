var Promise = require('bluebird');
var db = require('redis');
Promise.promisifyAll(db.RedisClient.prototype);
Promise.promisifyAll(db.Multi.prototype);

// Class that creates new DB instances and client connections for each game
// Initialize Redis either with heroku if .env included or local redis
var makeDBInfo = function() {
  this.client = db.createClient(process.env.REDIS_URL, {db: 0});

  this.client.on('error', function(err) {
    console.log('ERROR' + err);
  });
};



module.exports = makeDBInfo;
