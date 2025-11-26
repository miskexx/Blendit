import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const clock = new THREE.Clock();

const container = document.getElementById("lampa");

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
camera.position.set(1, 1, 50);

scene.add(new THREE.AmbientLight(0xffffff, 10));
const dir = new THREE.DirectionalLight(0xffffff, 3);
dir.position.set(1, 8, 7);
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
const loader = new GLTFLoader();
loader.load(
    "./assets/lampa.glb",
    (gltf) => {
        loadedModel = gltf.scene;
        scene.add(loadedModel);

        loadedModel.scale.set(3.5, 3.5, 3.5);

        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        loadedModel.position.sub(center);

        animate();
    },
    undefined,
    (err) => console.error("GLB load error:", err)
);


function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}