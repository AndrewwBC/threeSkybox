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

let pokemon;

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

const pokemonJoystick = { x: null, y: null };

function handleMaterialLoaded(materials) {
  materials.preload();
  objLoader.setMaterials(materials);
  objLoader.setPath(modelPath).load(objFile, handleObjectLoaded);
}

function handleObjectLoaded(object) {
  pokemon = object;
  pokemon.position.x = 1;
  pokemon.position.y = 1;

  pokemon.rotateZ(25);
  pokemon.rotateX(30);
  pokemon.rotateY(0);

  pokemon.scale.setScalar(1);
  scene.add(pokemon);
}

function animate() {
  renderer.render(scene, camera);
  controls.update();
  movepokemon();
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
      pokemon.position.x += 10;
      break;
    case "ArrowDown":
      pokemon.position.x -= 10;
      break;
    case "ArrowLeft":
      pokemon.position.y -= 10;

      break;
    case "ArrowRight":
      pokemon.position.y += 10;
      break;
    default:
      break;
  }
}

window.addEventListener("keydown", handleKeyPress);

function movepokemon() {
  if (pokemon && pokemonJoystick.x && pokemonJoystick.y) {
    let wh = window.innerHeight;
    let ww = window.innerWidth;

    pokemon.rotation.x += (pokemonJoystick.y - wh / 2) / wh / 100;

    if (Math.abs(pokemon.position.x) > 1) {
      pokemon.position.x =
        1 * (pokemon.position.x / Math.abs(pokemon.position.x));
    } else {
      pokemon.rotation.z -= (pokemonJoystick.x - ww / 2) / ww / 10;
    }

    if (Math.abs(pokemon.rotation.z) != 0) {
      pokemon.position.x += (pokemonJoystick.x - ww / 2) / ww / 10;
      pokemon.rotation.y = pokemon.rotation.z / 2.5;
    }

    if (Math.abs(pokemon.rotation.y) > 0.5)
      pokemon.rotation.y =
        0.5 * (pokemon.rotation.y / Math.abs(pokemon.rotation.y));
  }
}

window.addEventListener("click", (evento) => {
  console.log(evento.clientX);
});
