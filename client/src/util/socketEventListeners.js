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
      while ( game.scene.getObjectByName('questSuccess') ) {
        game.removeObject('questSuccess');
      }
      while ( game.scene.getObjectByName('questFail') ) {
        game.removeObject('questFail');
      }
      while ( game.scene.getObjectByName('party') ) {
        game.removeObject('party');
      }

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
        for (let j = 0; j < game.players.length; j++) {
          if (data.currentLeader === game.players[j].uid) {
            var position = {
              x: game.players[j].pos.x,
              y: game.players[j].pos.y + 50,
              z: game.players[j].pos.z
            };
            game.addPlayerToken('partyLeader', size, position, data.currentLeader);
          }
        }
        console.log(game.scene.getObjectByName(data.currentLeader));
      }

      //Add party leader token on top of camera ========> Take care of me
    }, roomId, socket.id);
    socket.on('resolveParty', function(data) {
      //Remove all tokens after choosing after choosing a party.
      while ( game.scene.getObjectByName('partyLeader') ) {
        game.removeObject('partyLeader');
      }
      while ( game.scene.getObjectByName(socket.id) ) {
        game.removeObject(socket.id);
      }

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
      for (let i = 0; i < data.partyMembers.length; i++) {
        if (game.scene.getObjectByName(data.partyMembers[i])) {
          var size = {
            x: 32,
            y: 32,
            z: 32
          };

          for (let j = 0; j < game.players.length; j++) {
            if (data.partyMembers[i] === game.players[j].uid) {
              var position = {
                x: game.players[j].pos.x,
                y: game.players[j].pos.y + 50,
                z: game.players[j].pos.z
              };
              game.addPlayerToken('party', size, position, data.partyMembers[i]);
            }
          }
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
      //Remove all sign before showing quest result. 
      while ( game.scene.getObjectByName('passQuest') ) {
        game.removeObject('passQuest');
      }

      if ( data.result === 'success' ) {
        game.addSign('questSuccess');
      } else if (data.result === 'failure') {
        game.addSign('questFail');
      }
      game.resolveQuest(data.result, data.successVotes, data.failureVotes);
    });
    socket.on('gameEnd', function(data) {
      console.log('Data I got from gameEnd', data);
      //Remove all signs when game ends. 
      while ( game.scene.getObjectByName('questSuccess') ) {
        game.removeObject('questSuccess');
      }
      while ( game.scene.getObjectByName('questFail') ) {
        game.removeObject('questFail');
      }

      game.addSign(data.winners === 'false' ? 'minionsWin' : 'heroesWin');
    });
    socket.on('chooseMerlin', function(data) {
      //Remove all sign before stabbing Merlin. 
      while ( game.scene.getObjectByName('heroesWin') ) {
        game.removeObject('heroesWin');
      }

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
      //Remove all sign before stabbing Merlin. 
      while ( game.scene.getObjectByName(data.winners === 'false' ? 'minionsWin' : 'heroesWin') ) {
        game.removeObject(data.winners === 'false' ? 'minionsWin' : 'heroesWin');
      }
      game.addSign('gameOver');
      
      console.log('Data I got from Game Over', data);
    });
  }
};