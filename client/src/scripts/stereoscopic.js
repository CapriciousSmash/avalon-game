// This function allows us to create a threeJS element that will effectively take
// the place of the renderer and bring the application into a stereoscopic view instead

var StereoEffect = function(renderer) {
  
  this.separation = 3;

  // Distance to non-parallax or projection plane
  this.focalLength = 15;

  var _width, _height;

  // Variables setting up the camera position and perspective
  var _position = new THREE.Vector3();
  var _quaternion = new THREE.Quaternion();
  var _scale = new THREE.Vector3();

  var _cameraL = new THREE.PerspectiveCamera();
  var _cameraR = new THREE.PerspectiveCamera();

  // Variables setting up the field of vision for the camera elements
  var _fov;
  var _outer, _inner, _top, _bottom;
  var _ndfl, _halfFocalWidth, _halfFocalHeight;
  var _innerFactor, _outerFactor;

  // initialization

  renderer.autoClear = false;

  // Note: If setSize is not called at least once before render, _width and
  // _height will be undefined and rendering will not work
  this.setSize = function (width, height) {

  	_width = width / 2;
  	_height = height;

  	renderer.setSize( width, height );

  };

  // Allows the element created here to hijack the normal webGL renderer in order to 
  // take what normally would have been rendered and turn it into two cameras with 
  // stereoscopic view
  this.render = function (scene, camera) {

  	scene.updateMatrixWorld();

  	if (camera.parent === undefined) {
  	  camera.updateMatrixWorld();
  	}
  
  	camera.matrixWorld.decompose( _position, _quaternion, _scale );

  	// Stereo frustum calculation

  	// Effective fov of the camera, lots of physics and geometry happening
  	_fov = THREE.Math.radToDeg( 2 * Math.atan( Math.tan( THREE.Math.degToRad( camera.fov ) * 0.5 ) ) );

  	_ndfl = camera.near / this.focalLength;
  	_halfFocalHeight = Math.tan( THREE.Math.degToRad( _fov ) * 0.5 ) * this.focalLength;
  	_halfFocalWidth = _halfFocalHeight * 0.5 * camera.aspect;

  	_top = _halfFocalHeight * _ndfl;
  	_bottom = -_top;
  	_innerFactor = ( _halfFocalWidth + this.separation / 2.0 ) / ( _halfFocalWidth * 2.0 );
  	_outerFactor = 1.0 - _innerFactor;

  	_outer = _halfFocalWidth * 2.0 * _ndfl * _outerFactor;
  	_inner = _halfFocalWidth * 2.0 * _ndfl * _innerFactor;

  	// makeFrustrum creates the conal field of vision for each camera with the parameters 
  	// that simulate actual vision

  	_cameraL.projectionMatrix.makeFrustum(
  	  -_outer,
  	  _inner,
  	  _bottom,
  	  _top,
  	  camera.near,
  	  camera.far
  	);
  	_cameraL.position.copy( _position );
  	_cameraL.quaternion.copy( _quaternion );
  	_cameraL.translateX( - this.separation / 2.0 );

  	_cameraR.projectionMatrix.makeFrustum(
  	  -_inner,
  	  _outer,
  	  _bottom,
  	  _top,
  	  camera.near,
  	  camera.far
  	);
  	_cameraR.position.copy(_position);
  	_cameraR.quaternion.copy(_quaternion);
  	_cameraR.translateX(this.separation / 2.0);

  	// Actually brings everything together to render the separate stereoscopic
  	// views
  	renderer.setViewport(0, 0, _width * 2, _height);
  	renderer.clear();

  	renderer.setViewport(0, 0, _width, _height);
  	renderer.render(scene, _cameraL);

  	renderer.setViewport(_width, 0, _width, _height);
  	renderer.render(scene, _cameraR);

  };

};

export default StereoEffect;
