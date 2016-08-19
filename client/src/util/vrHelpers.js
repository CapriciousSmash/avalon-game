export default {
  // VR event handlers were meant to work similarly to click handlers, but using
  // looking at an object for a certain period to simulate a "click" instead
  addVRPressEventListener: function(signName, maxSelects, callback, options) {
  	// Not dry, but two lines probably aren't worth a whole new module. :\
  	this.selected = [];
  	this.addSign(signName);

  	// Create event handler that holds onto the 'this' binding
  	let eventHandler = () => {
  	  this.itemSelection(signName, maxSelects, callback, options);
  	};
  	let boundHandler = eventHandler.bind(this);

  	let event = {
  	   name: signName,
  	   callback: boundHandler
  	};

  	// Treating the event listeners as an array of objects for now in case event
  	// handlers are expanded
  	this.VREventListeners.push(event);

  },
  removeVREventListener: function(eventName) {

  	let removeIdx = null;
  	for (let x = 0; x < this.VREventListeners.length; x++) {
  	  if (this.VREventListeners[x].name === eventName) {
  	  	removeIdx = x;
  	  }
  	}
  	if (removeIdx) {
  	  this.VREventListeners.splice(removeIdx, 1);
  	}

  },
  // Selection detection relies on the user looking at an object for approx.
  // 2 - 3 seconds before it counts as a click. Allows for users to avoid 
  // accidental activation
  selectionDetection: function() {
    
    if (this.intersected.length < 1) {
      this.VRSelectionTimer = 0;
      return;
    }
    let focusedObject = this.intersected[0].object;
    if (focusedObject.name === this.VRLastSelected.name) {
      this.VRSelectionTimer++;
      if (this.VRSelectionTimer > 100 && this.VREventListeners.length > 0) {
	    this.VREventListeners[0].callback();
      }
    } else {
      this.VRSelectionTimer = 0;
      this.VRLastSelected = focusedObject;
    }

  } 
};