var Promise = requre('bluebird');


// Class that creates new DB instances and client connections for each game
// Initialize Redis either with heroku if .env included or local redis
var makeCache = function(gameNumber) {
  this.gameNumber = gameNumber;
  this.db = require('redis').createClient(process.env.REDIS_URL);
  this.client = redis.createClient();

  this.client.on('error', function(err) {
    console.log('ERROR' + err);
  });


}

makeCache.prototype.function() {

};

module.exports = new makeCache();