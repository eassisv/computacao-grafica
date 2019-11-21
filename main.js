const scene = new THREE.Scene();
const width = window.innerHeight;
const height = window.innerHeight;

const aspectRatio = width / height;
// const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.CubeGeometry(1, 1, 1);
const cubeMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
  new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }),
  new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide }),
  new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide }),
  new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide }),
  new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide })
];
// Create a MeshFaceMaterial, which allows the cube to have different materials on each face
// const cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
const cube = new THREE.Mesh(geometry, cubeMaterials);
scene.add(cube);

camera.position.z = 5;

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "w":
      cube.rotation.x += 0.1;
      break;
    case "s":
      cube.rotation.x -= 0.1;
      break;
    case "a":
      cube.rotation.y += 0.1;
      break;
    case "d":
      cube.rotation.y -= 0.1;
      break;
    case "i":
      cube.rotation.z += 0.1;
      break;
    case "j":
      cube.rotation.z -= 0.1;
      break;
  }
});

const animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
