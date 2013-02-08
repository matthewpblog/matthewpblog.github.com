var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

function makeMaterial(color) {
  return new THREE.MeshLambertMaterial({color:color});
}

function makeCube(color) {
  var geometry = new THREE.CubeGeometry(1,1,1),
      material = makeMaterial(color);
  
  return new THREE.Mesh(geometry, material);
}

function makeText(str, color) {
  color = color || Math.random() * 0xffffff;

  var text3d = new THREE.TextGeometry(str, {
        size: 1,
        height: 0.2,
        curveSegments: 2,
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
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000),
    renderer = new THREE.WebGLRenderer();

renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

var greenCube = makeCube(0x158C00),
    redCube = makeCube(0xCF0000),
    link1 = makeText('portfolio');

scene.add(greenCube);
scene.add(redCube);
scene.add(link1);

var ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1,1,1).normalize();
scene.add(directionalLight);

camera.position.z = 5;

moveObject(redCube, 2, 2);
moveObject(link1, -6, 2, -1.75);

var rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
function animate() {
  rAF(animate);
  greenCube.rotation.x += 0.01; greenCube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
