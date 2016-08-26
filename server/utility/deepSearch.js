// Searches for the id within the player array
// returns the idex of that player
module.exports = function(id, arr) {
  for (var x = 0; x < arr.length; x++) {
    if (arr[x].uid === id) {
      return x;
    }
  }
}