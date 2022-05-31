import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import untypedData from "./data.json";
import { randomPick, randomNPick, normalize } from "./lib";

const nRandomPointsAround = (n: number, center: Vector3, dist: number) =>
  Array(n)
    .fill(null)
    .map(
      () =>
        new Vector3(
          center.x + dist * (-0.5 + Math.random()),
          center.y + dist * (-0.5 + Math.random()),
          center.z + dist * (-0.5 + Math.random())
        )
    );

const data = untypedData as number[][][];

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(1, 1, 1);
const controls = new TrackballControls(camera, renderer.domElement);

const green = new DirectionalLight(0x008800, 0.5);
green.position.set(-1, 0, 0);
const white = new DirectionalLight(0x888888, 0.5);
white.position.set(0, 1, 0);
const blue = new DirectionalLight(0x000088, 0.5);
blue.position.set(1, 0, 0);
const ambient = new AmbientLight(0x888888, 0.2);
scene.add(green, white, blue, ambient);

const pointsPerNode = 4;
const linkPoints = 3; // <= pointsPerNode
const nbSamples = 100;
const nbPaths = 4;
const nodeRadius = 0.02;

const material = new MeshStandardMaterial();
const source = randomPick(data);
const [rawXs, rawYs, rawZs] = randomNPick(source, 3);
const xs = normalize(rawXs).map((v) => v - 0.5);
const ys = normalize(rawYs).map((v) => v - 0.5);
const zs = normalize(rawZs).map((v) => v - 0.5);
const centers = xs.map((x, i) => new Vector3(x, ys[i], zs[i]));
const points = centers.map((center) =>
  nRandomPointsAround(pointsPerNode, center, nodeRadius)
);
for (let ci = 0; ci < centers.length; ci++) {
  scene.add(new Mesh(new ConvexGeometry(points[ci]), material));

  Array(nbSamples)
    .fill(null)
    .map(() => ~~(Math.random() * centers.length))
    .map((i) => ({
      i,
      d2:
        (centers[i].x - centers[ci].x) ** 2 +
        (centers[i].y - centers[ci].y) ** 2 +
        (centers[i].z - centers[ci].z) ** 2,
    }))
    .sort((a, b) => a.d2 - b.d2)
    .slice(0, nbPaths)
    .forEach(({ i }) => {
      if (ci === i) return;
      const link = new ConvexGeometry([
        ...points[ci].slice(0, linkPoints),
        ...points[i].slice(0, linkPoints),
      ]);
      scene.add(new Mesh(link, material));
    });
}

const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

window.addEventListener(
  "resize",
  () => {
    debugger;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    controls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);
