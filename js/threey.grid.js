var THREEY = THREEY || {};
THREEY.Grid = Grid;

// Grid
function Grid() {
  var material = new THREE.LineBasicMaterial({color:0x303030}),
      geometry = new THREE.Geometry(),
      floor = -75, step = 25;

  for(var i = 0; i <= 20; i++) {
    geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - 500 ) );
    geometry.vertices.push( new THREE.Vector3(   500, floor, i * step - 500 ) );
    geometry.vertices.push( new THREE.Vector3( i * step - 500, floor, -500 ) );
    geometry.vertices.push( new THREE.Vector3( i * step - 500, floor,  500 ) );
  }

  THREE.Line.call(this, geometry, material, THREE.LinePieces);
}

Grid.prototype = Object.create(THREE.Line.prototype);
Grid.prototype.constructor = Grid;
