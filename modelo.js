import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { createSkyBox } from "./skybox";

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

let aspecto = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(
  75, //campo de visao vertical
  aspecto, //aspecto da imagem (Largura/Altura)
  0.1, //Plano proximo
  100 //Plano distante
);
camera.position.z = 10;

//Luz
var light = new THREE.AmbientLight(0xffffff, 5);
scene.add(light);

//Ponto de Luz
var plight = new THREE.PointLight(0xffffff, 10);
plight.position.set(10, 10, 0);
scene.add(plight);

let jet; //referencia global ao modelo f15
const modelPath = "./assets/";
const mtlFile = "model.mtl";
const objFile = "model.obj";

const manager = new THREE.LoadingManager();
const mtlLoader = new MTLLoader(manager);
const objLoader = new OBJLoader();

manager.onProgress = (item, loaded, total) => {
  let percentLoaded = Number((loaded / total) * 100).toFixed();
  console.log(item, percentLoaded + "%");
};

mtlLoader.setPath(modelPath).load(mtlFile, handleMaterialLoaded);

function handleMaterialLoaded(materials) {
  materials.preload();
  objLoader.setMaterials(materials);
  objLoader.setPath(modelPath).load(objFile, handleObjectLoaded);
}

function handleObjectLoaded(object) {
  jet = object;
  jet.position.x = 0;
  jet.position.y = 0.05;
  jet.position.z = 5;
  jet.rotation.y = 0.78;
  jet.rotateZ(0.78);
  jet.rotateX(0.45);
  jet.scale.setScalar(1);
  scene.add(jet);
}

function animate() {
  renderer.render(scene, camera);
  jet.rotation.z += 0.01;
  requestAnimationFrame(animate);
}

createSkyBox("cortadas", 70).then((grama) => {
  console.log("grama criada");
  console.log(grama);
  scene.add(grama);
  animate();
});

function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowUp":
      jet.position.y += 1;
      break;
    case "ArrowDown":
      jet.position.y -= 1;
      break;
    case "ArrowLeft":
      jet.position.x -= 1;
      break;
    case "ArrowRight":
      jet.position.x += 1;
      break;
    default:
      break;
  }
}

window.addEventListener("keydown", handleKeyPress);
