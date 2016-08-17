module.exports = {
  addPlayer: function(uid, color, role) {
    console.log('add Player is running');
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

    // add the sphere to the scene
    this.scene.add(sphere);
  },
  removePlayer: function(uid) {
    this.scene.remove(this.scene.getObjectByName(uid));
    for (let x = 0; x < this.players.length; x++) {
      if (this.players[x].uid === uid) {
        this.players.splice(x, 1);
      }
    }
  },
  assignRoles: function(party, id, role) {
    if (role === 'MERLIN' || role === 'ASSASSIN' || role === 'MINION') {
      //every minion is shown as red
      for (let player in party) {
        if (party[player] === 'MINION') {
          this.scene.getObjectByName(player).material.color.setHex(roleColors['MINION']);
        }
      }
    }
    //give myself a color
    this.scene.getObjectByName(id).material.color.setHex(roleColors[role]);
  },
  showSign: function(stage) {
    let texture = this.textureLoader.load('images/button-text/' + stage + '.png');
    let plane = new THREE.PlaneGeometry(512, 128);
    let material = new THREE.MeshBasicMaterial({ map: texture });

    let sign = new THREE.Mesh(plane, material);

    sign.position.set(0, 110, 20);
    sign.name = stage;
    this.scene.add(sign);
  },
  hideSign: function(stage) {
    this.scene.remove(this.scene.getObjectByName(stage));
  },
  stabMerlin: function(sendPickedMerlin) {
    this.showSign('stabMerlin');

    let stabMerlin;
    this.renderer.domElement.addEventListener('click', stabMerlin = (e) => {
      let hitObject = this.intersect();   
      if (hitObject) {
        this.selected = hitObject;
        this.selected.material.color.setHex('0xFFFFFF');

        sendPickedMerlin(this.selected.name);
      }
      this.hideSign('stabMerlin');
      this.renderer.domElement.removeEventListener('click', stabMerlin);
    });

    setTimeout(()=>{
      this.hideSign('stabMerlin');
      sendPickedMerlin('No merlin selected');
      this.renderer.domElement.removeEventListener('click', stabMerlin);
    }, 5000);
  },
  pickParty: function(sendPickedParty, partyNumber) {
    this.showSign('pickParty');

    this.party = [];

    let pickParty;
    this.renderer.domElement.addEventListener('click', pickParty = (e) => {

      let hitObject = this.intersect();   
      if (hitObject) {
        this.selected = hitObject;
        this.selected.material.color.setHex('0xFFFFFF');

        if (this.party.indexOf(this.selected.name) < 0) {
          console.log('sending the chosen member', this.selected.name);
          this.party.push(this.selected.name);
        }
      }

      if (this.party.length >= partyNumber) {
        sendPickedParty(this.party);
        this.hideSign('pickParty');
        //This needs to be moved to resolvedParty
        this.renderer.domElement.removeEventListener('click', pickParty);
      }
    });

    setTimeout(()=>{
      this.hideSign('pickParty');
      sendPickedParty('no party members picked');
      this.renderer.domElement.removeEventListener('click', pickParty);
    }, 30000);
  },
  createVoteButtons: function(voteOnParty) {
    let geometry = new THREE.BoxGeometry(30, 10, 10);
    let acceptMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    let accept = new THREE.Mesh(geometry, acceptMaterial);
    accept.position.set(100, 100, 0);
    accept.name = 'accept';

    let rejectMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
    let reject = new THREE.Mesh(geometry, rejectMaterial);
    reject.position.set(100, 100 - 20, 0);
    reject.name = 'reject';

    this.scene.add(accept);
    this.scene.add(reject);

    let partyVote;
    this.renderer.domElement.addEventListener('click', partyVote = (e) => {
      let hitObject = this.intersect();   
      if (hitObject) {
        const vote = hitObject.name === 'reject' ? false : true;
        voteOnParty(vote);

        let acceptObject = this.scene.getObjectByName('accept');
        let rejectObject = this.scene.getObjectByName('reject');
        this.scene.remove(acceptObject);
        this.scene.remove(rejectObject);
        this.renderer.domElement.removeEventListener('click', partyVote);
      }
    });
    setTimeout(()=>{
      this.renderer.domElement.removeEventListener('click', partyVote);
    }, 30000);
  },   
  createQuestButtons: function(voteOnQuest) {
    let geometry = new THREE.BoxGeometry(30, 10, 10);
    let successMaterial = new THREE.MeshBasicMaterial({color: 0x0000FF});
    let success = new THREE.Mesh(geometry, successMaterial);
    success.position.set(100, 100, 0);
    success.name = 'success';

    let failMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
    let fail = new THREE.Mesh(geometry, failMaterial);
    fail.position.set(100, 100 - 20, 0);
    fail.name = 'fail';

    this.scene.add(success);
    this.scene.add(fail);


    let questVote;
    this.renderer.domElement.addEventListener('click', questVote = (e) => {
      let hitObject = this.intersect();   
      if (hitObject) {
        const vote = hitObject.name === 'fail' ? false : true;
        voteOnQuest(vote);

        let successObject = this.scene.getObjectByName('success');
        let failObject = this.scene.getObjectByName('fail');
        this.scene.remove(successObject);
        this.scene.remove(failObject);
        this.renderer.domElement.removeEventListener('click', questVote);
      }
    });

    setTimeout(()=>{
      this.renderer.domElement.removeEventListener('click', questVote);
    }, 30000);
  }
};