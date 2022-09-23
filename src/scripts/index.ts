import "../style/main.scss"
import gsap from "gsap"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"

// HTML Elements
const canvas = document.querySelector("canvas")!
const $loading = document.getElementById("loader")!

const scene = new THREE.Scene()
const raycaster = new THREE.Raycaster()
let currentIntersect: any = null
const rayDirection = new THREE.Vector3(0, -10, 0)
rayDirection.normalize()

const pointer = new THREE.Vector2()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// const axesHelper = new THREE.AxesHelper(10)
// scene.add(axesHelper)
const ambiantLight = new THREE.AmbientLight(0xffffff, 0.5)
const pointLight = new THREE.PointLight(0xff88dc, 0.3)
const pointLightSecondary = new THREE.PointLight(0x91a6ff, 0.3)
pointLight.position.set(-3, 20, 0)
pointLightSecondary.position.set(10, 12, 5)
scene.add(ambiantLight, pointLight, pointLightSecondary)
camera.position.set(15, 12, 15)
// camera.quaternion.setFromEuler(new THREE.Euler(-0.25, -0.79, -0.18))
const loader = new OBJLoader()

// load a resource
loader.load(
  "/living-room.obj",
  (object) => {
    $loading.style.opacity = "0"
    const SCALE = 1.75
    object.scale.set(SCALE, SCALE, SCALE)
    // object.rotation.y = Math.PI / 2
    scene.add(object)
  },
  (xhr) => {
    const percent = (xhr.loaded / xhr.total) * 100
    $loading.textContent = `${percent.toFixed(1)}%`
  }
)

// Elements for raycaster
const geometry = new THREE.BoxGeometry(3, 6, 2)
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  opacity: 0,
  transparent: true,
})
const financeDoor = new THREE.Mesh(geometry, material)
financeDoor.position.set(-1.75, 3, -8.5)

const fontLoader = new FontLoader()

let meshText: THREE.Mesh<TextGeometry, THREE.MeshPhongMaterial>
fontLoader.load("/clash-display.json", (font) => {
  const textGeometry = new TextGeometry("Finance Room", {
    font,
  })
  meshText = new THREE.Mesh(
    textGeometry,
    new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0,
      color: 0x000000,
      flatShading: true,
    })
  )
  const SCALE = 0.01

  meshText.position.set(-4, 6, -8)
  meshText.scale.set(SCALE, SCALE, SCALE)
  scene.add(meshText)
})
scene.add(financeDoor)

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// scene settings
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFShadowMap

scene.background = new THREE.Color("#000000")
renderer.setClearAlpha(1)

// orbit controls
const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.dampingFactor = 0.125

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  raycaster.setFromCamera(pointer, camera)
  render()
}
const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  raycaster.setFromCamera(pointer, camera)
  const objectsToTest = [financeDoor]
  const intersects = raycaster.intersectObjects(objectsToTest)
  currentIntersect = intersects.length ? intersects[0] : null
  if (currentIntersect) {
    document.body.style.cursor = "pointer"
    if (meshText) {
      gsap.to(meshText.material, { opacity: 1 })
    }
  } else {
    document.body.style.cursor = "default"
    if (meshText) {
      gsap.to(meshText.material, { opacity: 0 })
    }
  }
  renderer.render(scene, camera)
}
const render = () => {
  renderer.render(scene, camera)
}
const onPointerMove = (event: PointerEvent) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
}
animate()

// Events
window.addEventListener("resize", onWindowResize)
window.addEventListener("pointermove", onPointerMove)
document
  .querySelector(".reset-camera")!
  .addEventListener("click", () =>
    gsap.to(camera.position, { x: 15, y: 12, z: 15 })
  )
window.addEventListener("click", () => {
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case financeDoor:
        window.location.href = "/finance.html"
        break
      default:
        break
    }
  }
})
