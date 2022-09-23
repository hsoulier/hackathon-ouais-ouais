import "../style/main.scss"
import SplineLoader from "@splinetool/loader"
import gsap from "gsap"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

// HTML Elements
const canvas = document.querySelector("canvas")!
const $loading = document.getElementById("loader")!
const $modal = document.getElementById("dashboard")!

const scene = new THREE.Scene()
const raycaster = new THREE.Raycaster()
let currentIntersect: any = null
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
const rayDirection = new THREE.Vector3(0, -10, 0)
rayDirection.normalize()

const pointer = new THREE.Vector2()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(15, 12, 15)
// camera.quaternion.setFromEuler(new THREE.Euler(-0.25, -0.79, -0.18))

// Spline scene
const loader = new SplineLoader()
loader.load(
  "https://prod.spline.design/AwrDHewpN5-KqwLR/scene.splinecode",
  (splineScene) => {
    $loading.style.opacity = "0"
    const SCALE = 0.01
    splineScene.scale.set(SCALE, SCALE, SCALE)
    splineScene.rotation.y = Math.PI / 2
    scene.add(splineScene)
  },
  (xhr) => {
    const percent = (xhr.loaded / xhr.total) * 100
    $loading.textContent = `${percent.toFixed(1)}%`
  }
)

// Elements for raycaster
const geometry = new THREE.BoxGeometry(9, 6, 0.5)
const material = new THREE.MeshBasicMaterial({
  opacity: 0,
  transparent: true,
})
const bigScreen = new THREE.Mesh(geometry, material)
bigScreen.position.set(-0.5, 6.2, -8.5)
scene.add(bigScreen)

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
  const objectsToTest = [bigScreen]
  const intersects = raycaster.intersectObjects(objectsToTest)
  currentIntersect = intersects.length ? intersects[0] : null
  if (currentIntersect) {
    document.body.style.cursor = "pointer"
  } else {
    document.body.style.cursor = "default"
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
document
  .querySelector(".go-home")!
  .addEventListener("click", () => (window.location.href = "/"))
window.addEventListener("click", () => {
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case bigScreen:
        $modal.classList.add("open")
        break
      default:
        break
    }
  }
})

const exits = document.querySelectorAll(".modal-exit")
exits.forEach((exit) => {
  exit.addEventListener(
    "click",
    (event) => {
      event.preventDefault()
      const modal = exit.parentElement?.parentElement as HTMLElement
      if (modal.classList.contains("open")) modal.classList.remove("open")
    },
    true
  )
})
