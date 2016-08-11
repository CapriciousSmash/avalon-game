var Promise = requre('bluebird');
var db = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

// Class that creates new DB instances and client connections for each game
// Initialize Redis either with heroku if .env included or local redis
var makeCache = function(gameNumber) {
  this.gameNumber = gameNumber;
  this.client = db.createClient(process.env.REDIS_URL);

  this.client.on('error', function(err) {
    console.log('ERROR' + err);
  });


}

makeCache.prototype.makeDb() {

};

module.exports = new makeCache();