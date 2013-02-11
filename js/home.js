var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

function makeText(str, color) {
  color = color || Math.random() * 0xffffff;

  var text3d = new THREE.TextGeometry(str, {
        size: 1,
        height: 0.2,
        curveSegments: 5,
        font: "droid serif"
      }),
      material = new THREE.MeshLambertMaterial({
        color: color,
        overdraw: true
      });

  return new THREE.Mesh(text3d, material);
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

//camera.position.set(0, 300, 500);
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

var link1 = makeText('portfolio');

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
