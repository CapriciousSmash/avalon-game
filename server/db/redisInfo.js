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

// initInfo - initializes all the info for reference
makeDBInfo.prototype.initInfo = function(gameIds, max) {
  var id;
  for (var i = 0; i < gameIds.length; i++) {
    id = gameIds[i];
    this.client.setAsync(id + ':CAP:MAX', max);
    this.client.setAsync(id + ':CAP:CUR', 0);
    this.client.setAsync(id + ':STATUS', 'Waiting');
    this.client.saddAsync('GAMEIDS', id);
  }
  return this.client.smembersAsync('GAMEIDS');
};
// setCapMax - takes number to set new capacity maximum to
// getCapMax - returns number of the current capacity maximum
// getPlayerCount - returns the current player count
// incrPlayerCount - increases player count and returns new value
// decrPlayerCount - decreases player count and returns new value
// setStatus - takes a string to update the current game status
// getStatus - returns the current game status
// getAllGIDs - returns all the game ids stored and utilized


module.exports = makeDBInfo;
