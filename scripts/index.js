import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.getElementById("model-container");

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);


camera.position.set(2.5, 1.5, 6.0);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;

scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(5, 10, 7);
scene.add(dir);

// paralax
let mouseX = 0;
let mouseY = 0;
const targetRotationX = new THREE.Vector3(0, 0, 0);
const targetRotationY = new THREE.Vector3(0, 0, 0);


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
    "/assets/my-bot.glb", //cesta k assetu
    (gltf) => {
        loadedModel = gltf.scene;
        scene.add(loadedModel);

        // velikost modelu
        loadedModel.scale.set(1.2, 1.2, 1.2);

        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        loadedModel.position.sub(center);

        animate();
    },
);

// efekt otaceni
window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});


function animate() {
    requestAnimationFrame(animate);

    if (loadedModel) {
        // rotace modelu
        targetRotationY.y = mouseX * 0.3; 
        targetRotationX.x = mouseY * -0.3; 

        loadedModel.rotation.y += (targetRotationY.y - loadedModel.rotation.y) * 0.05;
        loadedModel.rotation.x += (targetRotationX.x - loadedModel.rotation.x) * 0.05;
    }

    controls.update();
    renderer.render(scene, camera);
}