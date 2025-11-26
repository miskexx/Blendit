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
camera.position.set(1, 0, 7);

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
    "./assets/kytka.glb",
    (gltf) => {
        loadedModel = gltf.scene;
        scene.add(loadedModel);

        loadedModel.scale.set(0.8, 0.8, 0.8);
        loadedModel.rotation.x = 1.5;
        loadedModel.rotation.y = 7;

        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        loadedModel.position.sub(center);

        const clone1 = loadedModel.clone(true);
        const clone2 = loadedModel.clone(true);

        clone1.scale.set(0.1, 0.1, 0.1);
        clone2.scale.set(0.3, 0.3, 0.3);

        clone1.position.set(-3, 0, 4);
        clone2.position.set(6, 1.5, 0);

        scene.add(clone1);
        scene.add(clone2);

        animate();
    },
    undefined,
    (err) => console.error("GLB load error:", err)
);


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}