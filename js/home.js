var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

function makeText(str, color) {
  color = color || Math.random() * 0xffffff;

  var text3d = new THREE.TextGeometry(str, {
        size: 1,
        height: 0.2,
        font: "droid serif"
      }),
      material = new THREE.MeshLambertMaterial({
        color: color,
        overdraw: true
      });

  text3d.computeBoundingBox();
  var bb = text3d.boundingBox,
      center = new THREE.Vector3();
  center.x = (bb.max.x - bb.min.x) / 2;
  center.y = (bb.max.y - bb.min.y) / 2;
  center.z = (bb.max.z - bb.min.z) / 2;
  text3d.vertices.forEach(function(vertex) {
    vertex.sub(center);
  });

  return new THREE.Mesh(text3d, material);
}

function makeLink(mesh) {
  mesh.geometry.computeBoundingBox();
  mesh.geometry.computeFaceNormals();

  var bb = mesh.geometry.boundingBox,
      size = new THREE.Vector3();
  size.x = bb.max.x - bb.min.x;
  size.y = bb.max.y - bb.min.y;
  size.z = bb.max.z - bb.min.z;

  var underlineH = size.y / 10,
      deltaY = size.y / 20;

  var geometry = new THREE.CubeGeometry(size.x, underlineH, size.z);
      cube = new THREE.Mesh(geometry, mesh.material);

  var axis = (new THREE.Vector3()).set(0, 1, 0),
      dist = -size.y / 2 - deltaY - underlineH / 2;
  cube.matrix.rotateAxis(axis);
  cube.position.add(axis.multiplyScalar(dist));

  mesh.add(cube);

  return mesh;
}

function moveObject(obj, x, y, z) {
  obj.position.x = x;
  obj.position.y = y;
  obj.position.z = z || obj.position.z;
}

var scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10000),
    renderer = new THREE.WebGLRenderer(),
    events = new THREEY.Events(camera, scene);

renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

var link1 = makeLink(makeText('portfolio'));

scene.add(link1);

var ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1,1,1).normalize();
scene.add(directionalLight);

camera.position.z = 5;
//moveObject(link1, -6, 2, -1.75);

var rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
function animate() {
  rAF(animate);
  renderer.render(scene, camera);
}
animate();

events.on(Events.EVENTS.MOVE, function(mesh) {
  var ha = '';
});
