import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const clock = new THREE.Clock();

const container = document.getElementById("model-container");

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

//scena, kamera, svetlo
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
camera.position.set(0.1, 0, 3);

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
const loader = new GLTFLoader();
loader.load(
    "./assets/blender-logo.glb",
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
    
    const elapsedTime = clock.getElapsedTime();

    if (loadedModel) {
        loadedModel.position.y = Math.sin(elapsedTime * 3) * 0.04; 
        loadedModel.rotation.y = Math.sin(elapsedTime * 1.5) * 0.1; 
    }

    renderer.render(scene, camera);
}
