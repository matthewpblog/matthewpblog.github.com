var THREEY = THREEY || {};
THREEY.Events = Events;

function Events(camera, scene) {
  this.projector = new THREE.Projector();
  this.camera = camera;
  this.scene = scene;
  this.intersected = null;
  this.mouse = {
    x: 0,
    y: 0,
    isDown: false,
    firedDown: false,
    firedUp: false
  };

  document.addEventListener('mousedown', this.mouseDown.bind(this));
  document.addEventListener('mouseup', this.mouseUp.bind(this));
  document.addEventListener('mousemove', this.mouseMove.bind(this));
}

Events.prototype.findIntersections = function() {
  var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
  this.projector.unprojectVector(vector, this.camera);

  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
  var intersects = raycaster.intersectObjects(this.scene.children);

  if(intersects.length > 0) {
    return intersects[0].object;
  }
};

Events.prototype.mouseMove = function(e) {
  e.preventDefault();
  this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

  var obj = this.findIntersections();
  if(this.intersected && obj !== this.intersected) {
    this.emit(Events.EVENTS.OUT, this.intersected);
  }

  if(obj && obj !== this.intersected) {
    this.emit(Events.EVENTS.OVER, obj);
  }

  if(!obj) {
    this.intersected = null;
    return;
  }

  this.intersected = obj;

  if(this.mouse.isDown) {
    if(!this.mouse.firedDown) {
      this.emit(Events.EVENTS.DOWN, obj);
      this.mouse.fireDown = true;
      this.mouse.firedUp = false;
    }
  } else {
    if(!this.mouse.firedUp) {
      this.emit(Events.EVENTS.UP, obj);
      this.mouse.firedUp = true;
      this.mouse.firedDown = false;
    }
  }

  this.emit(Events.EVENTS.MOVE, obj);
};

Events.prototype.mouseDown = function(e) {
  this.mouse.isDown = true;
};

Events.prototype.mouseUp = function(e) {
  this.mouse.isDown = false;
};

Events.EVENTS = {
  DOWN: 'down',
  UP: 'up',
  MOVE: 'move',
  OVER: 'over',
  OUT: 'out'
};

Emitter(Events.prototype);
