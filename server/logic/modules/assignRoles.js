module.exports.assignRoles = function(memcache) {
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

  // Make the first member of each side Merlin or the Assassin respectively
  party.merlin = party.knights[0];
  party.assassin = party.minions[0];

  // Update memcache with the correct party layout
  // memcache set for party.knights
  // memcache set for merlin
  // memcache set for minions
  // memcache set for assassin

  // assign party leader at random
  // memcache set for party leader (players[Math.floor(Math.random() * players.length)])

  return 'party';
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

  // Iterate through total of players
  while (numK + numM > 0) {
    // Randomly generate a number up to the remaining positions
    // If within the numK range
      // Assign that player as a knight
      // Decrement knights
      // Remove player from the list of players
    // If outside of the numK range
      // Assign that player as 
  }

  return party;
}