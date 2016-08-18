import init from '../util/gameSetup';
import inGame from '../util/inGameFunctions';
import helper from '../util/helperFunctions';

/*CONTENTS
THREE:  WIDTH, HEIGHT, scene, renderer, element, camera,
        pointLight, textureLoader, raycaster, camMouse, mouse

GAME VARS: players, roleColors, selected, clickEvent
*/

export default {
  init: function() {
    init.call(this); 
  },
  // Helper functions
  intersect: helper.intersect,
  addSign: helper.addSign,
  addButton: helper.addButton,
  removeObject: helper.removeObject,
  addClickEventListener: helper.addClickEventListener,
  removeClickEventListener: helper.removeClickEventListener,

  // In-game functions
  addPlayer: inGame.addPlayer,
  removePlayer: inGame.removePlayer,
  assignRoles: inGame.assignRoles,
  pickParty: inGame.pickParty,
  partyButtons: inGame.partyButtons,
  questButtons: inGame.questButtons,

};