import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.getElementById("model-container");

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 2000);


camera.position.set(1, 1, 5);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.enableRotate = false;

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
    "/assets/postavicka.glb", 
    (gltf) => {
        loadedModel = gltf.scene;
        scene.add(loadedModel);

        loadedModel.scale.set(1.2, 1.2, 1.2);

        loadedModel.rotation.y = 0.2; 

        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        loadedModel.position.sub(center);

        window.addEventListener('scroll', onScroll);

        animate();
    },
);


const INITIAL_ROTATION_Y = 0.2; 
loadedModel.rotation.y = INITIAL_ROTATION_Y;

function onScroll() {
    if (!loadedModel) return; 

    const scrollPosition = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scrollPosition / maxScroll : 0;
    const scrollRotation = 1.9 * Math.PI; 

    loadedModel.rotation.y = INITIAL_ROTATION_Y + (scrollProgress * scrollRotation);
}


function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}