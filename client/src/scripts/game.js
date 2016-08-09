export default {
  init:function(){
    //SET UP VARS////////////////
    this.players = [];
    //////////////////////////////
    const WIDTH = 500,
          HEIGHT = 500;

    const VIEW_ANGLE = 45,
          ASPECT = WIDTH/HEIGHT,
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
    var timer = 0;

    var render = () => {
      requestAnimationFrame(render);
      timer++;
      var d = new Date();
      pointLight.position.x += 30 * Math.sin(Math.floor(d.getTime()/10) * 0.02);
      pointLight.position.y += 20 * Math.sin(Math.floor(d.getTime()/10) * 0.01);
      renderer.render(scene, camera);

      for(var x = 0; x < this.players.length; x++){
        (this.scene.getObjectByName(this.players[x].uid)).position.x = (500/this.players.length)/2 * (x+1) - 250;
      }
    }
    render();
  },
  addPlayer: function(uid, color){
    if(this.players.length < 5){
      this.players.push({
        uid,
        x: this.players[this.players.length-1] ? this.players[this.players.length-1].x + 80 : -140,
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
      sphere.position.x = this.players[this.players.length-1].x;

      // add the sphere to the scene
      this.scene.add(sphere);
    } else {
      //too many dam players
    }
  },
  removePlayer: function(uid){
    this.scene.remove(this.scene.getObjectByName(uid));
    for(var x = 0; x < this.players.length; x++){
      if(this.players[x].uid === uid){
        this.players.splice(x, 1);
      }
    }
  },
  play:()=>{
    console.log('playing something');
  }
};