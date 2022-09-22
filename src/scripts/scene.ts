import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

const scene = new THREE.Scene()

const canvas = document.querySelector("canvas")!
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)
const light = new THREE.PointLight(0xffe75d, 1, 2000)
light.position.set(-4.5, 6.5, 2)
scene.add(light)

camera.position.x = 15
camera.position.y = 12
camera.position.z = 15

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
})
renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, canvas)

const loader = new GLTFLoader()

// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath("/examples/js/libs/draco/")
// loader.setDRACOLoader(dracoLoader)
loader.load(
  "/finance_room.gltf",
  function (gltf) {
    const SCALE = 0.01
    gltf.scene.scale.set(SCALE, SCALE, SCALE)
    gltf.scene.rotation.y = Math.PI / 2
    scene.add(gltf.scene)

    gltf.animations // Array<THREE.AnimationClip>
    gltf.scene // THREE.Group
    gltf.scenes // Array<THREE.Group>
    gltf.cameras // Array<THREE.Camera>
    gltf.asset // Object
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
  },
  // called when loading has errors
  function () {
    console.log("An error happened")
  }
)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)

cube.position.x = 10
scene.add(cube)

window.addEventListener("resize", onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

function animate() {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  controls.update()

  render()
}

function render() {
  renderer.render(scene, camera)
}
animate()
