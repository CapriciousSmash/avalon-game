var redisDb = require('../db/redis');
var shortid = require('shortid');

var memcache = {};
var lobbyState = {};
var players = {};
for (var x = 1; x <= 4; x ++) {
  //Initialize redis database
  var id = shortid.generate();
  memcache[id] = new redisDb(x);
  memcache[id].clear();
  memcache[id].initInfo(id);
  
  //Initialize server side save state variables
  players[id] = [];
  lobbyState[id] = {
    status: 'Waiting...',
    max: 5
  };  
}

module.exports = memcache;