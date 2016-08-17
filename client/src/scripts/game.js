import init from '../util/gameSetup';
import inGame from '../util/inGameFunction';

export default {
  init: function() {
   init.call(this); 
  },
  intersect: function() {
    //let mouseVector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);
    //this.raycaster.set(this.camera.position, mouseVector.sub(this.camera.position).normalize());
    //let intersected = this.raycaster.intersectObjects(this.scene.children);
    this.raycaster.setFromCamera( this.mouse, this.camera);
    let intersected = this.raycaster.intersectObjects(this.scene.children);
    if (intersected[0]) {
      return intersected[0].object;
    }
    return null;
  },

  // In-game functions
  addPlayer: inGame.addPlayer,
  removePlayer: inGame.removePlayer,
  assignRoles: inGame.assignRoles,
  showSign: inGame.showSign,
  hideSign: inGame.hideSign,
  pickParty: inGame.pickParty,
  createVoteButtons: inGame.createVoteButtons,
  createQuestButtons: inGame.createQuestButtons,
};