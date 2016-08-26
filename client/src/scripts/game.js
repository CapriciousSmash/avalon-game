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
  init: function(vrSetting) {
    init.call(this, vrSetting); 
  },
  // Helper functions
  intersect: helper.intersect,
  addSign: helper.addSign,
  addPlayerSign: helper.addPlayerSign,
  addButton: helper.addButton,
  addSelf: helper.addSelf,
  addPlayerToken: helper.addPlayerToken,
  removeObject: helper.removeObject,
  addClickEventListener: helper.addClickEventListener,
  removeClickEventListener: helper.removeClickEventListener,
  itemSelection: helper.itemSelection,
  resolveQuest: helper.resolveQuest,
  setCircleCoordinates: helper.setCircleCoordinates,
  positionPlayers: helper.positionPlayers,
  resetPlayers: helper.resetPlayers,

  // In-game functions
  createFloor: inGame.createFloor,
  addAllPlayers: inGame.addAllPlayers,
  addPlayer: inGame.addPlayer,
  addAllPlayers: inGame.addAllPlayers,
  removePlayer: inGame.removePlayer,
  assignRoles: inGame.assignRoles,
  pickParty: inGame.pickParty,
  // WHAT DOES THE PARTYMEMBER FUNCTION DO???????????????
  partyMembers: inGame.partyMembers,
  partyButtons: inGame.partyButtons,
  questButtons: inGame.questButtons,
  stabMerlin: inGame.stabMerlin,

  // VR specific functions
  addVRPressEventListener: vrHelpers.addVRPressEventListener,
  removeVREventListener: vrHelpers.removeVREventListener,
  selectionDetection: vrHelpers.selectionDetection

};