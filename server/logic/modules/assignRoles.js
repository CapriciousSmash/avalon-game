const chooseParty = require('./chooseParty').chooseParty;

module.exports.assignRoles = function(memcache, socket) {
  // Note: memcache needs to store the current stage in the game.
  // TODO: 
  // memcache set current stage to 'roles'

  // randomly determine each player's role.  Assign only one Merlin and one Assassin
  // Knights are good guys, minions are bad guys
  var players = ; // array of entire party obtained from memcache call
  var knights = Math.floor(players.length / 3 * 2);
  var minions = players.length - knights;

  // Therefore, knights and minions should look like this
  //  5 = 3k + 2m
  //  6 = 4k + 2m
  //  7 = 4k + 3m
  //  8 = 5k + 3m
  //  9 = 6k + 3m
  // 10 = 6k + 4m

  // Assign the players to Knights or Minions
  var party = randomizeRoles(knights, minions, players);

  // Make a random member of each side Merlin or the Assassin respectively
  party.merlin = party.knights[Math.floor(Math.random() * party.knights.length)];
  party.assassin = party.minions[Math.floor(Math.random() * party.knights.length)];

  // Update memcache with the correct party layout
  // memcache set for party.knights
  // memcache set for merlin
  // memcache set for minions
  // memcache set for assassin

  // assign party leader at random
  // memcache set for party leader (players[Math.floor(Math.random() * players.length)])

  // TODO: set up next function in chain:
  // Step 1: Signal to each player their assigned role
  socket.emit('assignRoles', {
    // To differentiate the correct game
    gameId: 5318008,
    // TODO: Format of return to players for role assignment is playerId: role
    playerId: 'role <-- TO BE UPDATED -->'
  });
  setTimeout(function() {
    chooseParty(memcache, socket);
  }, 5000000);
  
  return 'party';
}

// Takes in number of Knights, Minions, and an array of the player names/id
// Returns an object with the group broken down into Merlin, Knights, Assassin, and minions
// TODO: write test(s)
// NOTE: Does work as intended
const randomizeRoles = function(numK, numM, players) {
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

  // return party;
  // setTimeout for chooseParty
}
