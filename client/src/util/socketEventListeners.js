import game from '../scripts/game';

module.exports = {
  gameInit: function(socket, vrSetting) {
    game.init(vrSetting);
    //Show user
    $('#gameUserInfoContainer .userName').text( socket.id );

    //Add all the people in the game to canvas
    socket.on('allPeers', function(players) {
      game.addAllPlayers(players, socket.id);
    });

    socket.on('peerLeft', function(uid) {
      game.removePlayer(uid);
    });
  },
  allListeners: function(socket, roomId) {
    socket.on('assignRoles', function(data) {
      game.assignRoles(data, socket.id, data[socket.id]);
      console.log('I AM', socket.id, ':', data[socket.id]);
      //Append div on top of canvas to show user's role
      //Did this to reduce amount of objects in canvas that is needed to be rendered
      $('#gameUserInfoContainer .role').text( data[socket.id] );
    });
    socket.on('chooseParty', function(data) {
      // Update gamestate but safeguard against server having issues with memcache. 
      game.gameState.currentRound = data.currentRound ? 
        data.currentRound : game.gameState.currentRound;
      
      //Remove all sign before choosing a party
      game.removeObject('questSuccess');
      game.removeObject('questFail');
      game.removeObject('party');

      if (data.currentLeader === socket.id) {
        game.pickParty(party => {
          console.log('preparing to pick the party');
          socket.emit('pickParty', {
            partyList: party
          }, roomId);
        }, data.partySize, socket.id);
        console.log('Data I got from sendParty', data);
      } else {
        var size = {
          x: 32,
          y: 32,
          z: 32
        };
        var position = {
          x: game.scene.getObjectByName(data.currentLeader).position.x,
          y: 50,
          z: game.scene.getObjectByName(data.currentLeader).position.z
        };
        game.addPlayerToken('partyLeader', size, position, data.currentLeader);
      }

      //Add party leader token on top of camera ========> Take care of me
    }, roomId, socket.id);
    socket.on('resolveParty', function(data) {
      game.removeObject('partyLeader');
      game.removeObject(socket.id);
      console.log('Data I got from resolveParty', data);
      game.resetPlayers(game.players, game.scene, game.gameState.ownRole);
    });
    socket.on('startVote', function(data) {
      game.partyMembers(data.partyMembers);
      game.partyButtons(voteOnParty => {
        socket.emit('voteOnParty', {
          playerId: socket.id,
          vote: voteOnParty
        }, roomId);
      });
      for (var i = 0; i < data.partyMembers.length; i++) {
        if (game.scene.getObjectByName(data.partyMembers[i])) {
          var size = {
            x: 32,
            y: 32,
            z: 32
          };
          var position = {
            x: game.scene.getObjectByName(data.partyMembers[i]).position.x,
            y: 60,
            z: game.scene.getObjectByName(data.partyMembers[i]).position.z
          };
          game.addPlayerToken('party', size, position, data.partyMembers[i]);
        } else {
          //Add token on top of camera ========> Take care of this someone.
        }
      }
      console.log('Data I got from startVote', data);
    });
    socket.on('resolveVote', function(data) {
      // data.result will yield 'accepted' or 'rejected'
      console.log('Data I got from resolveVote', data);
    });
    socket.on('startQuest', function(data) {
      console.log('Data I got from startQuest', data);
      if (data.partyMembers.includes(socket.id)) {
        game.questButtons(voteOnQuest => {
          socket.emit('voteOnQuest', {
            playerId: socket.id,
            vote: voteOnQuest
          }, roomId);
        });
        game.addSign('passQuest');
      }
    });
    socket.on('resolveQuest', function(data) {
       // data.result will yield 'failure' or 'success'
      console.log('Data I got from resolveQuest', data);
      game.removeObject('passQuest');
      if ( data.result === 'success' ) {
        game.addSign('questSuccess');
      } else if (data.result === 'failure') {
        game.addSign('questFail');
      }
      game.resolveQuest(data.result, data.successVotes, data.failureVotes);
    });
    socket.on('gameEnd', function(data) {
      console.log('Data I got from gameEnd', data);
      game.removeObject('questSuccess');
      game.removeObject('questFail');

      game.addSign(data.winners === 'false' ? 'minionsWin' : 'heroesWin');
    });
    socket.on('chooseMerlin', function(data) {
      game.removeObject('heroesWin');
      game.stabMerlin(player => {
        socket.emit('stabMerlin', 
          {
            merlindId: player[0],
            playerId: socket.id
          }, roomId);
      });
    });
    socket.on('resolveMerlin', function(data) {
      game.addSign(data.winners === 'false' ? 'minionsWin' : 'heroesWin');

      console.log('Data I got from resolveMerlin', data);
    });
    socket.on('gameOver', function(data){
      game.removeObject(data.winners === 'false' ? 'minionsWin' : 'heroesWin');
      game.addSign('gameOver');
      
      console.log('Data I got from Game Over', data);
    });
  }
};