import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { createSkyBox } from "./skybox";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

let aspecto = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(
  75, //campo de visao vertical
  aspecto, //aspecto da imagem (Largura/Altura)
  0.1, //Plano proximo
  100000 //Plano distante
);
camera.position.z = 5000;

//Luz
var light = new THREE.AmbientLight(0xffffff, 5);
scene.add(light);

//Ponto de Luz
var plight = new THREE.PointLight(0xffffff, 100);
plight.position.set(10, 10, 10);
scene.add(plight);

let aviao;

const modelPath = "./assets/";
const mtlFile = "aviao.mtl";
const objFile = "aviao.obj";

const manager = new THREE.LoadingManager();
const mtlLoader = new MTLLoader(manager);
const objLoader = new OBJLoader();

manager.onProgress = (item, loaded, total) => {
  let percentLoaded = Number((loaded / total) * 100).toFixed();
  console.log(item, percentLoaded + "%");
};

mtlLoader.setPath(modelPath).load(mtlFile, handleMaterialLoaded);

const controls = new OrbitControls(camera, renderer.domElement);

const aviaoJoystick = { x: null, y: null };

function handleMaterialLoaded(materials) {
  materials.preload();
  objLoader.setMaterials(materials);
  objLoader.setPath(modelPath).load(objFile, handleObjectLoaded);
}

function handleObjectLoaded(object) {
  aviao = object;
  aviao.position.x = 2;
  aviao.position.y = 4;

  aviao.rotateZ(25);
  aviao.rotateX(30);
  aviao.rotateY(0);

  aviao.scale.setScalar(1);
  scene.add(aviao);
}

function animate() {
  renderer.render(scene, camera);
  controls.update();
  moveaviao();
  movePlane();
  requestAnimationFrame(animate);
}

createSkyBox("cortadas", 100000).then((grama) => {
  console.log("grama criada");
  console.log(grama);

  scene.add(grama);
  grama.position.y = 35;
  animate();
});

function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowUp":
      aviao.rotateY(-0.1);
      aviao.position.y += 40;

      break;

    case "ArrowDown":
      aviao.rotateY(0.1);
      aviao.position.x -= 40;

      break;

    case "ArrowLeft":
      aviao.rotateX(25);
      break;

    case "ArrowRight":
      aviao.rotateX(32);
      break;

    default:
      break;
  }
}

window.addEventListener("keydown", handleKeyPress);

function moveaviao() {
  if (aviao && aviaoJoystick.x && aviaoJoystick.y) {
    let wh = window.innerHeight;
    let ww = window.innerWidth;

    aviao.rotation.x += (aviaoJoystick.y - wh / 2) / wh / 100;

    if (Math.abs(aviao.position.x) > 1) {
      aviao.position.x = 1 * (aviao.position.x / Math.abs(aviao.position.x));
    } else {
      aviao.rotation.z -= (aviaoJoystick.x - ww / 2) / ww / 10;
    }

    if (Math.abs(aviao.rotation.z) != 0) {
      aviao.position.x += (aviaoJoystick.x - ww / 2) / ww / 10;
      aviao.rotation.y = aviao.rotation.z / 2.5;
    }

    if (Math.abs(aviao.rotation.y) > 0.5)
      aviao.rotation.y = 0.5 * (aviao.rotation.y / Math.abs(aviao.rotation.y));
  }
}

function movePlane() {
  if (aviao) {
    aviao.position.x += 2;

    if (aviao.position.z < -1000) {
      aviao.position.z = 5000;
    }
  }
}

window.addEventListener("click", (evento) => {
  console.log(evento.clientX);
});
