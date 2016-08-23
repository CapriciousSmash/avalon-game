export default {
  // Using threeJS raycaster to map our object selection attempts to something in the 3D matrix
  intersect: function() {
    // Old code: probably should delete: 
    //let mouseVector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0).unproject(this.camera);
    //this.raycaster.set(this.camera.position, mouseVector.sub(this.camera.position).normalize());
    //let intersected = this.raycaster.intersectObjects(this.scene.children);

    // If the user is usingVR, the raycaster should only use the camera, while the 
    // non-VR version should apply both camera and mouse
    if (this.usingVR) {
      this.raycaster.set(
        this.camera.getWorldPosition(), 
        this.camera.getWorldDirection()
      );
    } else {
      this.raycaster.setFromCamera(this.mouse, this.camera); 
    }

    this.intersected = this.raycaster.intersectObjects(this.scene.children);

    if (this.intersected[0]) {
      return this.intersected[0].object;
    }
    return null;
  },
  // Adds display text to the screen to inform users of current game stage or progress
  addSign: function(stage) {
    let texture = this.textureLoader.load('images/button-text/' + stage + '.png');
    let plane = new THREE.PlaneGeometry(512, 128);
    let material = new THREE.MeshBasicMaterial({ map: texture });
    material.transparent = true;

    let sign = new THREE.Mesh(plane, material);

    sign.position.set(0, 110, 20);
    sign.name = stage;
    this.scene.add(sign);
  },
  // Adds the relevant buttons to the screen to allow users to perform actions appropriate
  // to the game phase
  addButton: function(name, option, size, position) {
    let geometry = new THREE.BoxGeometry(size.lenx, size.leny, size.lenz);
    let material = new THREE.MeshPhongMaterial(option);
    let button = new THREE.Mesh(geometry, material);
    button.position.set(position.posx, position.posy, position.posz);
    button.name = name;

    this.scene.add(button);
  },
  addSelf: function(name) {
    let geometry = new THREE.CylinderGeometry( 0, 10, 30, 64 );
    let material = new THREE.MeshLambertMaterial({color: this.roleColors['defaultColors']});
    let cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.set(0, -40, 225);
    cylinder.name = name;

    this.scene.add(cylinder);
  },
  removeObject: function(name) {
    this.scene.remove(this.scene.getObjectByName(name));
  },
  // Options may include a choices array that denotes the possible objects that should be 
  // getting clicked on. Allows for filtering of these objects. 
  addClickEventListener: function(signName, maxSelects, callback, options) {
    this.selected = [];
    this.addSign(signName);

    this.renderer.domElement.addEventListener('click', this.clickEvent = (e) => {
      // Code originally part of this click handler moved to itemSelection in order to be
      // usable by both click and VR
      console.log('click detected');
      this.itemSelection(signName, maxSelects, callback, options);
    });
  },
  removeClickEventListener: function() {
    this.renderer.domElement.removeEventListener('click', this.clickEvent);    
  },
  // Function that is called by either the click event listener or the VR selection 
  itemSelection: function(signName, maxSelects, callback, options) {
    
    let hitObject = this.intersected.length > 0 ? this.intersected[0].object : null;

    console.log('item selection run. hit object: ', hitObject);

    if(!hitObject) {
      return;
    }
    
    console.log('signName: ', signName);
    console.log('maxselects', maxSelects);
    console.log('type of callback: ', typeof callback);
    console.log('comparing choices of ', options);
    console.log('to hitobject named: ', hitObject.name);
    if (options.choices && options.choices.indexOf(hitObject.name) > -1) {
      console.log('check passed');
      this.scene.getObjectByName(hitObject.name).material.color.setHex(0xff69b4);        
      if (this.selected.indexOf(hitObject.name) < 0) {
        this.selected.push(hitObject.name);
        console.log('added to selected. new selected: ', this.selected);
      }
    } 
    if (this.selected.length >= maxSelects) {
      callback(this.selected);
      this.removeObject(signName);
      this.removeClickEventListener(this.clickEvent);
    }     

  },
  // Takes a list of players and sets them into a circle formation. 
  // Returns the same list of players with coordinate property added
  setCircleCoordinates: function(players, radius) {

    // Interval is decided by players to render + the "self" player
    // Angle is in radians as Math.sin() works with radians instead of angles
    let angle = (2 * Math.PI) / (players.length + 1);

    // Note: As the camera begins at z of the radius on the 3D plane, the "circle" 
    // the players will make will have z "x coordinteas" and x "y coordinates"
    for (let x = 0; x < players.length; x++) {
      let position = (x + 1) * angle;
      // coords are recorded in regards to the 3D plane
      let coords = {
        x: Math.floor(Math.sin(position) * radius),
        y: 0,
        z: Math.floor(Math.cos(position) * radius)
      }
      players[x].pos = coords;
    }

    return players;

  },
  // Move players to their correct position based on the position property
  positionPlayers: function(players, scene) {

    let numPlayers = players.length;

    for (let x = 0; x < numPlayers; x++) {
      let playerObj = scene.getObjectByName(players[x].uid);
      // If scene.getObjectByName returned a falsy value, this means that it is
      // the uid is of the "self" player
      if (playerObj) {
        let moveX = playerObj.position.x > players[x].pos.x ? -1 : playerObj.position.x < players[x].pos.x ? 1 : 0;
        let moveZ = playerObj.position.z > players[x].pos.z ? -1 : playerObj.position.z < players[x].pos.z ? 1 : 0;

        playerObj.position.x += moveX;
        playerObj.position.z += moveZ;
      }
    }

    // Corrently position the players based on the number of current players 
    // let numPlayers = this.players.length;
    // for (let x = 0; x < numPlayers; x++) {
    //   let playerObj = this.scene.getObjectByName(this.players[x].uid);
    //   if (playerObj.position.x > Math.floor((500 / numPlayers) / 2 * (1 + (2 * x)) - 250)) {
    //     playerObj.position.x -= 2;
    //   } else if (playerObj.position.x < Math.floor((500 / numPlayers) / 2 * (1 + (2 * x)) - 250)) {
    //     playerObj.position.x += 2;
    //   }
    // }

  }
};