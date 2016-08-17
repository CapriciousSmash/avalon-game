export default {
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
  addSign: function(stage) {
    let texture = this.textureLoader.load('images/button-text/' + stage + '.png');
    let plane = new THREE.PlaneGeometry(512, 128);
    let material = new THREE.MeshBasicMaterial({ map: texture });

    let sign = new THREE.Mesh(plane, material);

    sign.position.set(0, 110, 20);
    sign.name = stage;
    this.scene.add(sign);
  },
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
  addClickEventListener: function(signName, maxSelects, callback) {
    this.selected = [];
    this.addSign(signName);

    this.renderer.domElement.addEventListener('click', this.clickEvent = (e) => {
      let hitObject = this.intersect();
      if (hitObject) {
        if (this.selected.indexOf(hitObject.name) < 0) {
          this.selected.push(hitObject.name);
        }
      }
      if (this.selected.length >= maxSelects) {
        callback(this.selected);
        this.removeObject(signName);
        this.removeClickEventListener(this.clickEvent);
      }
    });
  },
  removeClickEventListener: function() {
    this.renderer.domElement.removeEventListener('click', this.clickEvent);    
  }
};