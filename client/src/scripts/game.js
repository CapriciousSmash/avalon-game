export default {
  init: function () {

    //SET UP VARS////////////////
    this.players = [];
    this.party = [];
    this.roleColors = {
      KNIGHT: 0x00b8ff,
      merlin: 0x007cab,
      MINION: 0xFF0000,
      assassin: 0x850000,
      //defaultColor: 0xffce00
      defaultColor: 0x00b8ff
    };

    // Using self to maintain context in inner functions, but can probably be
    // refactored by making those functions arrow functions

    var self = this;

    //SET UP SCENE////////////////

    // Scene related constant variables: 
    let $gameContainer = $('#gameContainer');
    this.WIDTH = window.innerWidth,
    this.HEIGHT = window.innerHeight;
    const VIEW_ANGLE = 45,
          ASPECT = this.WIDTH / this.HEIGHT,
          NEAR = 0.1,
          FAR = 10000;

    // Init scene
    this.scene = new THREE.Scene();

    // Init renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.WIDTH, this.HEIGHT);

    this.element = this.renderer.domElement;
    $gameContainer.append(this.element);

    // Init camera
    this.camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE, ASPECT, NEAR, FAR
      );
    this.camera.position.z = 500;
    this.scene.add(this.camera);
    
    this.textureLoader = new THREE.TextureLoader();

    this.raycaster = new THREE.Raycaster();
    this.camMouse = {
      x: 0,
      y: 0
    }; 
    this.mouse = new THREE.Vector2();

    //MAIN DOCUMENT LISTENERS/////////////////////
    document.addEventListener('mousemove', (e) => {
      //console.log('{', e.clientX, e.clientY, '}');
      this.mouse.x = (e.clientX / this.WIDTH) * 2 - 1;
      this.mouse.y = - (e.clientY / this.HEIGHT) * 2 + 1;
      this.camMouse.x = (e.clientX - this.WIDTH / 2);
      this.camMouse.y = (e.clientY - this.HEIGHT / 2);
    }, false);

    window.addEventListener('resize', ()=> {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );

/*  //SKY BOX///////////////////////////////////
    //Todo: Convert to tga format, speedier loadup vs png
    // this.TGAloader = new THREE.TGALoader();
    // var imgLoc = 'skybox/ame_ash/ashcanyon_';
    // var skyboxImages = [imgLoc + 'px.tga', imgLoc + 'nx.tga',
    //                     imgLoc + 'py.tga', imgLoc + 'ny.tga', 
    //                     imgLoc + 'pz.tga', imgLoc + 'nz.tga'];
    ////REMOVE SKYBOX FOR MVP
    this.cubeLoader = new THREE.CubeTextureLoader();
    this.cubeLoader.setPath('skybox/ame_ash/');
    var skyboxImages = ['px.png', 'nx.png',
                        'py.png', 'ny.png', 
                        'pz.png', 'nz.png'];
    var textureCube = this.cubeLoader.load(skyboxImages);
    textureCube.format = THREE.RGBFormat;
    this.scene.background = textureCube;
*/
    //LIGHTS////////////////////////////////////
    let pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.set = (10, 50, 130);
    this.scene.add(pointLight);

    //RENDER////////////////////////////////////

    let render = () => {

      requestAnimationFrame(render);

      let d = new Date();
      pointLight.position.x += 30 * Math.sin(Math.floor(d.getTime() / 10) * 0.02);
      pointLight.position.y += 20 * Math.sin(Math.floor(d.getTime() / 10) * 0.01);

      this.renderer.render(this.scene, this.camera);

      let numPlayers = this.players.length;
      for (let x = 0; x < numPlayers; x++) {
        let playerObj = this.scene.getObjectByName(this.players[x].uid);
        if (playerObj.position.x > Math.floor((500 / numPlayers) / 2 * (1 + (2 * x)) - 250)) {
          playerObj.position.x -= 2;
        } else if (playerObj.position.x < Math.floor((500 / numPlayers) / 2 * (1 + (2 * x)) - 250)) {
          playerObj.position.x += 2;
        }
      }

      this.camera.position.x += (this.camMouse.x - this.camera.position.x) * 0.05;
      this.camera.position.y += ( - this.camMouse.y - this.camera.position.y) * 0.05;
      this.camera.lookAt(this.scene.position);

    };
    render();
  },
  addPlayer: function(uid, color, role) {
    console.log('add Player is running');
    if (this.players.length <= 10) {
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
    } else {
      //too many dam players
    }
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
        console.log(this.selected.name);
        sendPickedMerlin(this.selected.name);
      }
      this.hideSign('stabMerlin');
      this.renderer.domElement.removeEventListener('click', stabMerlin);
    });

    setTimeout(()=>{
      this.hideSign('stabMerlin');
      //Send nothing, taken care of on serverside
      this.renderer.domElement.removeEventListener('click', stabMerlin);
    }, 5000);
  },
  pickParty: function(sendPickedParty, partyNumber) {
    this.showSign('pickParty');

    this.party = [];

    let pickParty;
    this.renderer.domElement.addEventListener('click', pickParty = (e) => {

      let hitObject = this.intersect();   
      console.log('HIT', hitObject);
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
  }
};