//IMG a VIDEO
document.addEventListener("DOMContentLoaded", () => {

    const multimedialniElementy = document.querySelectorAll("img, video");

    const prekryv = document.createElement("div");
    prekryv.id = "lightbox-overlay";

    document.body.appendChild(prekryv);

    multimedialniElementy.forEach((element) => {
        element.addEventListener("click", () => {
            prekryv.innerHTML = ''; 

            if (element.tagName === "IMG") {
                const zvetsenyElement = document.createElement("img");
                zvetsenyElement.src = element.src;
                prekryv.appendChild(zvetsenyElement);

            } else if (element.tagName === "VIDEO") {
                const videoElement = document.createElement("video");
                
                videoElement.controls = true; 
                videoElement.autoplay = true; 
                videoElement.loop = false; 

                element.querySelectorAll("source").forEach(source => {
                    const novaSource = document.createElement("source");
                    novaSource.src = source.src;
                    novaSource.type = source.type;
                    videoElement.appendChild(novaSource);
                });

                if (videoElement.childElementCount === 0 && element.hasAttribute('src')) {
                    videoElement.src = element.src;
                }
                
                prekryv.appendChild(videoElement);
            }

            prekryv.style.display = "flex";
        });
    });

    prekryv.addEventListener("click", (e) => {
        if (e.target === prekryv) {
            prekryv.style.display = "none";

            const aktivniVideo = prekryv.querySelector('video');
            if (aktivniVideo) {
                aktivniVideo.pause();
                aktivniVideo.currentTime = 0; 
            }
        }
    });
});

//Raketa a Hvězdy
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const clock = new THREE.Clock();
const container = document.getElementById("raketa");

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
camera.position.set(1, 0, 4);

scene.add(new THREE.AmbientLight(0xffffff, 1));
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


let loadedRocketModel;
const loader = new GLTFLoader();

loader.load(
    "/assets/raketa.glb",
    (gltf) => {
        loadedRocketModel = gltf.scene;
        scene.add(loadedRocketModel);

        loadedRocketModel.scale.set(1, 1, 1);
        loadedRocketModel.rotation.x = 0.5;

        const box = new THREE.Box3().setFromObject(loadedRocketModel);
        const center = box.getCenter(new THREE.Vector3());
        loadedRocketModel.position.sub(center);
    },
    undefined,
    (err) => console.error("GLB load error - raketa:", err)
);

const NUM_STARS = 3; 
const starModels = [];

const starPositions = [
    new THREE.Vector3(-5, 2, -3), 
    new THREE.Vector3(5, 0, -3),   
    new THREE.Vector3(0, -3, -5)   
];


loader.load(
    "/assets/hvezda.glb", 
    (gltf) => {
        const starTemplate = gltf.scene;
        
        for (let i = 0; i < NUM_STARS; i++) {
            const starClone = starTemplate.clone(true); 
            
            // NASTAVENÍ PEVNÉ POZICE
            starClone.position.copy(starPositions[i]);

            starClone.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );

            const scale = 0.3 + Math.random() * 0.5; 
            starClone.scale.set(scale, scale, scale);
            
            scene.add(starClone);
            starModels.push(starClone);
        }

        animate(); 
    },
    undefined,
    (err) => console.error("GLB load error - hvezda:", err)
);

function animate() {
    requestAnimationFrame(animate);
    
    if (loadedRocketModel) {
        loadedRocketModel.rotation.y += 0.003;
    }
    starModels.forEach(star => {
        star.rotation.y += 0.005;
    });

    renderer.render(scene, camera);
}