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


camera.position.set(1, 2, 6);


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

const geometry = new THREE.BoxGeometry(2, 2, 2); 

const positionAttribute = geometry.getAttribute('position');

const originalXPositions = [];
for (let i = 0; i < positionAttribute.count; i++) {
    originalXPositions.push(positionAttribute.getX(i));
}

var material = new THREE.MeshPhongMaterial( {
    visible: false,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
} );
var mesh = new THREE.Mesh( geometry, material );

var geo = new THREE.EdgesGeometry( mesh.geometry );
var mat = new THREE.LineBasicMaterial( { color: 0x091434 } );
var wireframe = new THREE.LineSegments( geo, mat );
mesh.add( wireframe );

const box = new THREE.Box3().setFromObject(mesh);
const center = box.getCenter(new THREE.Vector3());
mesh.position.sub(center);

scene.add(mesh); 

const clock = new THREE.Clock(); 
const animationSpeed = 1;

animate();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    const stretchFactor = (Math.sin(time * animationSpeed) * 0.3) + 0.3;
    const maxWidth = 2.0; 

    for (let i = 0; i < positionAttribute.count; i++) {
        const originalX = originalXPositions[i];
        const newX = originalX * (1 + stretchFactor * maxWidth);
        positionAttribute.setX(i, newX);
    }
    
 
    mesh.rotation.y = Math.sin(time * 0.5) * 0.2;
    

    positionAttribute.needsUpdate = true;

    mesh.remove(wireframe);
    geo.dispose(); 
    geo = new THREE.EdgesGeometry( mesh.geometry ); 
    wireframe = new THREE.LineSegments( geo, mat );
    mesh.add( wireframe ); 


    controls.update();
    renderer.render(scene, camera);
}