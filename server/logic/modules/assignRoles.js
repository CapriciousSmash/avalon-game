var chooseParty = require('./chooseParty').chooseParty;

module.exports.assignRoles = function(memcache, socket) {
  // Note: memcache needs to store the current stage in the game.
  // TODO: 
  // memcache set current stage to 'roles'
  memcache.setTurnPhase('ROLES');

  // randomly determine each player's role.  Assign only one Merlin and one Assassin
  // Knights are good guys, minions are bad guys
  // Get a list of players from the memcache
  memcache.getPids().then(function(pidsList) {
    //Prepare the data object that will be returned to the players
    var data = {};

    var knights = Math.floor(pidsList.length / 3 * 2);
    var minions = pidsList.length - knights;

    // Therefore, knights and minions should look like this
    //  5 = 3k + 2m
    //  6 = 4k + 2m
    //  7 = 4k + 3m
    //  8 = 5k + 3m
    //  9 = 6k + 3m
    // 10 = 6k + 4m

    // Assign the players to Knights or Minions
    var party = randomizeRoles(knights, minions, pidsList);

    // Make a random member of each side Merlin or the Assassin respectively
    party.merlin = party.knights[Math.floor(Math.random() * party.knights.length)];
    party.assassin = party.minions[Math.floor(Math.random() * party.knights.length)];

    // Update memcache with the correct party layout
    for (var x = 0; x < party.knights.length; x++) {
      data[party.knights[x]] = 'KNIGHT';
      memcache.setRole(party.knights[x], 'KNIGHT');
    } 
    for (var y = 0; y < party.minions.length; y++) {
      data[party.minions[y]] = 'MINION'
      memcache.setRole(party.minions[y], 'MINION');
    }
    if (party.merlin) {
      data['merlin'] = party.merlin;
      memcache.setMerlin(party.merlin);
    }
    if (party.assassin) {
      data['assassin'] = party.assassin;
      memcache.setAssassin(party.assassin);
    }

    // Assign party leader at random and save to memcache: 
    memcache.setLeader(pidsList[Math.floor(Math.random() * pidsList.length)]);

    // Sample data that would be given by socket.emit
    // {
      // gameId: 5138008,
      // player1: 'KNIGHT',
      // player2: 'MINION',
      // player3: 'KNIGHT',
      // merlin: 'player1',
      // assassin: 'player2'
    // }
    socket.emit('assignRoles', data);

    setTimeout(function() {
      chooseParty(memcache, socket);
    }, 5000); 

  });
}

// Takes in number of Knights, Minions, and an array of the player names/id
// Returns an object with the group broken down into Merlin, Knights, Assassin, and minions
var randomizeRoles = function(numK, numM, players) {
  // Merlin and Assassin should only ever have one player attached to it
  // Knights and Minions should be an array of those players, even if it is only one
  var party = {
    merlin: null,
    knights: [],
    assassin: null,
    minions: []
  };

  var side;

  // Iterate through total of players
  while (numK + numM > 0) {

    // Deceide which team player goes to
    if (numK < 1) {
      // If there are no more knight spots
      // make them a minion
      side = 1;
    } else if (numM < 1){
      // if there are no more minion spots
      // make them a knight
      side = 0;
    } else {
      // Randomly generate a number between 0 and 2 (0 or 1) if there are knight and minion spots open
      side = Math.floor(Math.random() * 2);
    }

    // If 0
    if (side === 0){
      // Assign last player as a knight
      party.knights.push(players.pop());
      // Decrement knights
      numK--;
    } else if (side === 1) {
      // Assign last player as a minion
      party.minions.push(players.pop());
      // Decrement minions
      numM--;
    }
  }

  return party;
  // setTimeout for chooseParty
}
