import init from '../util/gameSetup';
import inGame from '../util/inGameFunctions';
import helper from '../util/helperFunctions';
import vrHelpers from '../util/vrHelpers';

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
  addSelf: helper.addSelf,
  removeObject: helper.removeObject,
  addClickEventListener: helper.addClickEventListener,
  removeClickEventListener: helper.removeClickEventListener,
  itemSelection: helper.itemSelection,
  resolveQuest: helper.resolveQuest,
  setCircleCoordinates: helper.setCircleCoordinates,
  positionPlayers: helper.positionPlayers,

  // In-game functions
  createFloor: inGame.createFloor,
  addAllPlayers: inGame.addAllPlayers,
  addPlayer: inGame.addPlayer,
  addAllPlayers: inGame.addAllPlayers,
  removePlayer: inGame.removePlayer,
  assignRoles: inGame.assignRoles,
  pickParty: inGame.pickParty,
  partyMembers: inGame.partyMembers,
  partyButtons: inGame.partyButtons,
  questButtons: inGame.questButtons,

  // VR specific functions
  addVRPressEventListener: vrHelpers.addVRPressEventListener,
  removeVREventListener: vrHelpers.removeVREventListener,
  selectionDetection: vrHelpers.selectionDetection

};