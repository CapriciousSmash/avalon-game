function render() {
  requestAnimationFrame(render.bind(this));

  let d = new Date();
  this.pointLight.position.x += 30 * Math.sin(Math.floor(d.getTime() / 10) * 0.02);
  this.pointLight.position.y += 20 * Math.sin(Math.floor(d.getTime() / 10) * 0.01);

  this.intersect();

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
}

export default function init() {
  //SET UP VARS////////////////
  this.players = [];
  this.roleColors = {
    KNIGHT: 0x00b8ff,
    merlin: 0x007cab,
    MINION: 0xFF0000,
    assassin: 0x850000,
    //defaultColor: 0xffce00
    defaultColor: 0x00b8ff
  };

  //SET UP SCENE////////////////
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
  this.pointLight = new THREE.PointLight(0xFFFFFF);
  this.pointLight.position.set = (10, 50, 130);
  this.scene.add(this.pointLight);

  render.call(this);
}