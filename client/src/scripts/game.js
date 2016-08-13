export default {
  init: function () {
    //SET UP VARS////////////////
    this.players = [];
    this.party = [];

    //SET UP SCENE////////////////
    let $gameContainer = $('#gameContainer');
    this.WIDTH = window.innerWidth,
    this.HEIGHT = window.innerHeight;

    const VIEW_ANGLE = 45,
          ASPECT = this.WIDTH / this.HEIGHT,
          NEAR = 0.1,
          FAR = 10000;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    $gameContainer.append(this.renderer.domElement);
    
    this.camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE, ASPECT, NEAR, FAR
      );
    this.camera.position.z = 500;


    this.scene = new THREE.Scene();
    this.scene.add(this.camera);

    this.raycaster = new THREE.Raycaster();
    this.mouseVector = new THREE.Vector3(0, 0, 0);

    this.mouse = {
      x: 0,
      y: 0
    };

    this.textureLoader = new THREE.TextureLoader();
    //////////////////////////////
    let pointLight = new THREE.PointLight(0xFFFFFF);

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // add to the scene
    this.scene.add(pointLight);

    //RENDER//////////////////////////
    let render = () => {

      requestAnimationFrame(render);

      let d = new Date();
      pointLight.position.x += 30 * Math.sin(Math.floor(d.getTime() / 10) * 0.02);
      pointLight.position.y += 20 * Math.sin(Math.floor(d.getTime() / 10) * 0.01);
      this.renderer.render(this.scene, this.camera);

      // this.scene.getObjectByName('mouse').position.x = this.mouse.x;
      // this.scene.getObjectByName('mouse').position.y = this.mouse.y;

      for (let x = 0; x < this.players.length; x++) {
        (this.scene.getObjectByName(this.players[x].uid)).position.x = (500 / this.players.length) / 2 * (1 + (2 * x)) - 250;
      }
    };
    render();
  },
  addPlayer: function(uid, color) {
    if (this.players.length < 5) {
      this.players.push({
        uid,
        x: this.players[this.players.length - 1] ? this.players[this.players.length - 1].x + 80 : -140,
        y: 0,
        color,
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
      sphere.position.x = this.players[this.players.length - 1].x;

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
  showSign: function(stage) {
    let texture = this.textureLoader.load('images/button-text/' + stage + '.png');
    let plane = new THREE.PlaneGeometry(200, 100);
    let material = new THREE.MeshBasicMaterial({
      map: texture
    });

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
      console.log('{', e.clientX, e.clientY, '}');
      this.mouse.x = (e.clientX / this.WIDTH) * 2 - 1;
      this.mouse.y = - (e.clientY / this.HEIGHT) * 2 + 1;

      this.mouseVector.set( this.mouse.x, this.mouse.y, 0 ).unproject(this.camera);

      this.raycaster.set(this.camera.position, this.mouseVector.sub(this.camera.position).normalize());

      let intersects = this.raycaster.intersectObjects(this.scene.children);      
      if (intersects.length) {
        this.selected = intersects[0].object;
        this.selected.material.color.setHex('0xFFFFFF');
        console.log(this.selected);
        //sendPickedMerlin(this.selected.name);
        sendPickedMerlin('selectedPlayer');
      }
      this.hideSign('stabMerlin');
      this.renderer.domElement.removeEventListener('click', stabMerlin);
    });
  },
  pickParty: function(sendPickedParty, partyNumber) {
    this.showSign('pickParty');

    this.party = [];

    let pickParty;
    this.renderer.domElement.addEventListener('click', pickParty = (e) => {
      console.log('{', e.clientX, e.clientY, '}');
      this.mouse.x = (e.clientX / this.WIDTH) * 2 - 1;
      this.mouse.y = - (e.clientY / this.HEIGHT) * 2 + 1;

      this.mouseVector.set( this.mouse.x, this.mouse.y, 0 ).unproject(this.camera);

      this.raycaster.set(this.camera.position, this.mouseVector.sub(this.camera.position).normalize());

      let intersects = this.raycaster.intersectObjects(this.scene.children);      
      if (intersects.length) {
        this.selected = intersects[0].object;
        this.selected.material.color.setHex('0xFFFFFF');
        console.log(this.selected);
        this.party.push(this.selected.name);
      }

      if (this.party.length >= partyNumber) {
        console.log('sending the chosen members');
        //sendPickedParty(this.party);
        sendPickedParty(['playa1', 'playa2', 'playaplaya']);
        this.hideSign('pickParty');
        this.renderer.domElement.removeEventListener('click', pickParty);
      }
    });    
  },
  play: ()=>{
    console.log('playing something');
  },
};