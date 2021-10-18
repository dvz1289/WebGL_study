import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Color } from 'three'
import * as dat from 'dat.gui'
import gsap from 'gsap/all'

/**
 * Textures
 */
// const image = new Image()
// const texture = new THREE.Texture(image)

// image.onload = () => {
//     texture.needsUpdate = true
// }

// image.src = '/textures/door/color.jpg'

// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load('/textures/door/color.jpg')

const loadingManager = new THREE.LoadingManager()

// loadingManager.onStart = () => {
//     console.log('onStart')
// }
// loadingManager.onLoaded = () => {
//     console.log('onLoaded')
// }
// loadingManager.onProgress = () => {
//     console.log('onProgress')
// }
// loadingManager.onError = () => {
//     console.log('onError')
// }

const textureLoader = new THREE.TextureLoader(loadingManager)

const colorTexture = textureLoader.load('/textures/minecraft.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png')
// const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alpahTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcculusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture  = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI / 4
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

// colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter // good performence

// /**
//  * Debug - hide/show button 'h'
//  */
const gui = new dat.GUI({ closed: true, width: 400 })


const parameters = {
    color: 0xffc3,
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2})
    }
}

/**
 * cursor
 */
const cursor = {
    x: 0,
    y: 0
}

// positive, negative setting
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    // set viewport fit
    width: window.innerWidth,
    height: window.innerHeight

    // set specified size
    // width: 800,
    // height: 600
}

// Resize Updating
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Fullscreen use double click
window.addEventListener('dblclick', () => 
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement){
        if(canvas.requestFullscreen){
            canvas.requestFullscreen()
        }else if(canvas.webkitFullscreenElement){
            canvas.webkitFullscreenElement()
        }
    }else{
        if(document.exitFullscreen){
            document.exitFullscreen()
        }else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen()
        }
    }
})

// Scene
const scene = new THREE.Scene()

// Object
// *** Don't use buffer geometry ***
// box geometry
/*
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
*/
const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
console.log(geometry.attributes.uv)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)

// buffer geometry
/*
const geometry = new THREE.BufferGeometry()

const count = 500
const positionArray = new Float32Array(count * 3 * 3)

for(let i = 0; i < count * 3 * 3; i++){
    positionArray[i] = (Math.random() - 0.5) * 2
}

// const positionArray = new Float32Array(9)
// const positionArray = new Float32Array([
//     0, 0, 0,
//     0, 1, 0,
//     1, 0, 0
// ])
const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
geometry.setAttribute('position', positionAttribute)
const material = new THREE.MeshBasicMaterial({ color: 0x0ff000, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
*/

scene.add(mesh)

// Debug
// gui.add(mesh.position, 'x', -3, 3, 0.01)
// gui.add(mesh.position, 'y', -3, 3, 0.01)
// gui.add(mesh.position, 'y').min(-3).max(3).step(0.01)
gui
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevation')
// gui.add(mesh.position, 'z', -3, 3, 0.01)

// boolean
gui
    .add(mesh, 'visible')

gui
    .add(mesh.material, 'wireframe')

gui
    .addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color)
    })

gui
    .add(parameters, 'spin')

// Camera
// Perspective Camera
// const camera = new THREE.PerspectiveCamera(vertical fov, aspect ratiom, near, far)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

// Orthographic Camera
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)

// Camera settings

// static camera seettings
// camera.position.x = 2
// camera.position.y = 2

camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

/**
 * Controls
 */
 const controls = new OrbitControls(camera, canvas)
//  physics moving(soft move)
 controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // Update camera(moving obj)

    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 5

    // camera.position.x = cursor.x * 10
    // camera.position.y = cursor.y * 10

    // Update controls
    // physics moving
    controls.update()

    // fix obj
    // camera.lookAt(mesh.position)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()