export default {
  init: function () {
    //SET UP VARS////////////////
    this.players = [];
    //////////////////////////////
    const WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;

    const VIEW_ANGLE = 45,
          ASPECT = WIDTH / HEIGHT,
          NEAR = 0.1,
          FAR = 10000;

    var $gameContainer = $('#gameContainer');

    var renderer = new THREE.WebGLRenderer();
    var camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE, ASPECT, NEAR, FAR
      );

    var scene = new THREE.Scene();
    this.scene = scene;

    scene.add(camera);
    camera.position.z = 500;

    renderer.setSize(WIDTH, HEIGHT);

    $gameContainer.append(renderer.domElement);
    

    var pointLight =
      new THREE.PointLight(0xFFFFFF);

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // add to the scene
    scene.add(pointLight);

    //MOUSE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.mouse = {
      x: 0,
      y: 0
    };

    console.log('Trial 1');

    var raycaster = new THREE.Raycaster();
    this.mouseVector = new THREE.Vector3(0, 0, 0);
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    renderer.domElement.addEventListener( 'click', (e) => {
      //off by 8px and 30px 
      console.log('{', e.clientX, e.clientY, '}');
      this.mouse.x = (e.clientX / WIDTH) * 2 - 1;
      this.mouse.y = - (e.clientY / HEIGHT) * 2 + 1;

      this.mouseVector.set( this.mouse.x, this.mouse.y, 0 ).unproject(camera);

      raycaster.set(camera.position, this.mouseVector.sub(camera.position).normalize());

      let intersects = raycaster.intersectObjects(scene.children);      
      if (intersects.length) {
        this.selected = intersects[0].object;
        this.selected.material.color.setHex('0xFFFFFF');
        console.log(this.selected);
      }
    });

    //MOUSE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var render = () => {

      requestAnimationFrame(render);

      let d = new Date();
      pointLight.position.x += 30 * Math.sin(Math.floor(d.getTime() / 10) * 0.02);
      pointLight.position.y += 20 * Math.sin(Math.floor(d.getTime() / 10) * 0.01);
      renderer.render(scene, camera);

      // this.scene.getObjectByName('mouse').position.x = this.mouse.x;
      // this.scene.getObjectByName('mouse').position.y = this.mouse.y;

      for (var x = 0; x < this.players.length; x++) {
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
    for (var x = 0; x < this.players.length; x++) {
      if (this.players[x].uid === uid) {
        this.players.splice(x, 1);
      }
    }
  },
  play: ()=>{
    console.log('playing something');
  },
};