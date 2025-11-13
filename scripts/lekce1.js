import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const container = document.getElementById("kostka");

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);


camera.position.set(2, 2, 4);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.enabled = false;

scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(5, 10, 7);
scene.add(dir);


function onWindowResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

onWindowResize();
window.addEventListener('resize', onWindowResize);


let loadedModel;

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ color: 0xEEEEEE });


loadedModel = new THREE.Mesh(geometry, material);

const box = new THREE.Box3().setFromObject(loadedModel);
const center = box.getCenter(new THREE.Vector3());
loadedModel.position.sub(center);

scene.add(loadedModel);

animate();


function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}




document.addEventListener("DOMContentLoaded", () => {
  const obrazky = document.querySelectorAll("img");

  const prekryv = document.createElement("div");
  prekryv.id = "lightbox-overlay";

  const zvetsenyObrazek = document.createElement("img");
  prekryv.appendChild(zvetsenyObrazek);
  document.body.appendChild(prekryv);

  obrazky.forEach((obrazek) => {
    obrazek.addEventListener("click", () => {
      zvetsenyObrazek.src = obrazek.src;
      prekryv.style.display = "flex";
    });
  });

  prekryv.addEventListener("click", (e) => {
    if (e.target === prekryv) {
      prekryv.style.display = "none";
    }
  });
});