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

    let sign = new THREE.Mesh(plane, material);

    sign.position.set(0, 110, 20);
    sign.name = stage;
    this.scene.add(sign);
  },
  // Adds the relevant buttons to the screen to allow users to perform actions appropriate
  // to the game phase
  addButton: function(name, color, size, position) {
    let geometry = new THREE.BoxGeometry(size.lenx, size.leny, size.lenz);
    let material = new THREE.MeshBasicMaterial({color});
    let button = new THREE.Mesh(geometry, material);
    button.position.set(position.posx, position.posy, position.posz);
    button.name = name;

    this.scene.add(button);
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
      this.itemSelection(signName, maxSelects, callback, options);
    });
  },
  removeClickEventListener: function() {
    this.renderer.domElement.removeEventListener('click', this.clickEvent);    
  },
  // Function that is called by either the click event listener or the VR selection 
  itemSelection: function(signName, maxSelects, callback, options) {
    
    let hitObject = this.intersected.length > 0 ? this.intersected[0].object : null;

    if(!hitObject) {
      return;
    }
    if (options.choices && options.choices.indexOf(hitObject.name) > -1) {
      this.scene.getObjectByName(hitObject.name).material.color.setHex(0xff69b4);        
      if (this.selected.indexOf(hitObject.name) < 0) {
        this.selected.push(hitObject.name);
      }
    } else if (hitObject) {
      // Note: this may be useless code, but keeping until options.choices has been
      // implemented for everything that might call this function
      console.log('hitObject', hitObject);
      //change clicked to pink color
      this.scene.getObjectByName(hitObject.name).material.color.setHex(0xff69b4);        
      if (this.selected.indexOf(hitObject.name) < 0) {
        this.selected.push(hitObject.name);
      }
    }
    if (this.selected.length >= maxSelects) {
      callback(this.selected);
      this.removeObject(signName);
      this.removeClickEventListener(this.clickEvent);
    }     

  }
};