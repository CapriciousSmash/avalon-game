module.exports = {
  addPlayer: function(uid, color, role) {
    this.players.push({
      uid,
      x: 0,
      y: 0,
      color,
      role: this.roleColors['defaultColor']
    });      

    let sphereMaterial =
      new THREE.MeshLambertMaterial({
          color
      });
    let radius = 20,
        segments = 16,
        rings = 16;
    let sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, rings),
      sphereMaterial);

    sphere.name = uid;
    sphere.position.x = 0;

    this.scene.add(sphere);
  },
  removePlayer: function(uid) {
    this.removeObject(uid);    
    for (let x = 0; x < this.players.length; x++) {
      if (this.players[x].uid === uid) {
        this.players.splice(x, 1);
      }
    }
  },
  assignRoles: function(party, id, role) {
    if (role === 'MERLIN' || role === 'ASSASSIN' || role === 'MINION') {
      //Show minions as red to these characters
      for (let player in party) {
        if (party[player] === 'MINION') {
          this.scene.getObjectByName(player).material.color.setHex(roleColors['MINION']);
        }
      }
    }
    //Give color to my character
    this.scene.getObjectByName(id).material.color.setHex(roleColors[role]);
  },
  stabMerlin: function(sendPickedMerlin) {
    this.addClickEventListener('stabMerlin', 1, sendPickedMerlin);

    setTimeout(()=>{
      //Remove sign and click event listener if no choice made
      this.removeObject('stabMerlin');
      this.removeClickEventListener();
    }, 5000);
  },
  pickParty: function(sendPickedParty, partyNumber) {
    this.addClickEventListener('pickParty', partyNumber, sendPickedParty);

    setTimeout(()=>{
      //Remove sign and click event listener if no choice made      
      this.removeObject('pickParty');
      this.removeClickEventListener();
    }, 30000);
  },
  partyButtons: function(voteOnParty) {
    this.addButton(
      'accept', 
      0xFFFFFF, 
      { lenx: 30, leny: 10, lenz: 10 }, 
      { posx: 100, posy: -80, posz: 0 }
    );
    this.addButton(
      'reject', 
      0xFF0000, 
      { lenx: 30, leny: 10, lenz: 10 }, 
      { posx: 100, posy: -100, posz: 0 }
    );

    //All stages will have signs but not all stages will have buttons
    //Extend callback to remove buttons after choices have been made
    const votePartyCallback = (choice) => {
      voteOnParty(choice[0] === 'reject' ? false : true);
      
      this.removeObject('accept');
      this.removeObject('reject');      
    };

    this.addClickEventListener('approveParty', 1, votePartyCallback);

    setTimeout(()=>{
      this.removeObject('approveParty'); 
      this.removeObject('accept');
      this.removeObject('reject');       
      this.renderer.domElement.removeEventListener('click', this.clickEvent);
    }, 30000);
  },   
  questButtons: function(voteOnQuest) {
    this.addButton(
      'success', 
      0x0000FF, 
      { lenx: 30, leny: 10, lenz: 10 }, 
      { posx: 100, posy: -80, posz: 0 }
    );    
    this.addButton(
      'fail', 
      0xFF0000, 
      { lenx: 30, leny: 10, lenz: 10 }, 
      { posx: 100, posy: -100, posz: 0 }
    );      

    //All stages will have signs but not all stages will have buttons
    //Extend callback to remove buttons after choices have been made
    const voteQuestCallback = (choice) =>{
      voteOnParty(choice[0] === 'fail' ? false : true);
      //remove buttons
      this.removeObject('accept');
      this.removeObject('reject');      
    };

    this.addClickEventListener('passQuest', 1, voteQuestCallback);

    setTimeout(()=>{
      this.removeObject('passQuest');
      this.removeObject('accept');
      this.removeObject('reject');        
      this.renderer.domElement.removeEventListener('click', this.clickEvent);
    }, 30000);
  }
};