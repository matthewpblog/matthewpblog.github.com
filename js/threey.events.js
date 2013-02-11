var mouse = {
  x: 0,
  y: 0,
  isDown: false
};

function mouseMove(e) {
  e.preventDefault();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * 2 + 1;
}

function mouseDown(e) {
  mouse.isDown = true;
}

function mouseUp(e) {
  mouse.isDown = false;
}

function resetEvents(evt, fn) {
  document.removeEventListener(evt, fn, false);
  document.addEventListener(evt, fn, false);
}

var THREEY = THREEY || {};
THREEY.Events = Events;

function Events(camera, scene) {
  resetEvents('mousemove', mouseMove);
  this.projector = new THREE.Projector();
  this.camera = camera;
  this.scene = scene;
  this.handlers = {};
}

Events.prototype.findIntersections = function() {
  var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
  this.projector.unprojectVector(vector, this.camera);

  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
  var intersects = raycaster.intersectObjects(this.scene.children);

  if(intersects.length > 0) {
    if(this.intersected != intersects[0].object) {
      if(this.intersected) {
        this.intersected.material.emissive.setHex(this.intersected.currentHex);
      }
    
      this.intersected = intersects[0].object;
      this.intersected.currentHex = this.intersected.material.emissive.getHex();
      this.intersected.material.emissive.setHex(0xff0000);
    }
  } else {
    if(this.intersected) {
      this.intersected.material.emissive.setHex(this.intersected.currentHex);
    }
    this.intersected = null;
  }
};

Events.EVENTS = {
  DOWN: 'down',
  UP: 'up',
  MOVE: 'move'
};

Events.prototype.on = function(evt, obj, fn) {
  var handlers = this.handlers[evt] = this.handlers[evt] || [];
  handlers.push([obj, fn]);
};

Events.prototype.off = function(evt, obj, fn) {
  var handlers = (this.handlers[evt] || [])
    .filter(function(handler) {
      return handler[0] == obj;
    })
    .map(function(handler, idx) {
      return idx;
    });

  if(fn) {
    var self = this;
    handlers.forEach(function(idx) {
      var handler = self.handlers[idx];
      if(handler[1] == fn) {
        self.handlers.splice(idx, 1);
      }
    });
  } else {
    this.handlers = this.handlers.filter(function(handler, idx) {
      return handlers.indexOf(idx) === -1;
    });
  }
};

Events.prototype.emit = function(evt, obj) {
  var args = Array.prototype.slice.call(arguments, 1);
  var handlers = this.handlers[evt] || [];
  if(!handlers.length) {
    return;
  }

  handlers.filter(function(handler) {
    return handler[0] == obj;
  })
  .forEach(function(handler) {
    var fn = handler[1];
    fn.apply(args);
  });
};
