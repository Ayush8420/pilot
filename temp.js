import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap'
import { GUI } from 'dat.gui'
import Lenis from 'lenis';



gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

const lenis = new Lenis({
    duration: 3
})

lenis.on('scroll', (e) => {
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.lagSmoothing(0)

function scrollToPosition(position) {
    lenis.scrollTo(position);
}


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true })

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color("#ffffff"), 0)
renderer.setPixelRatio(window.devicePixelRatio);
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.ReinhardToneMapping;
// renderer.physicallyCorrectLights = true;
THREE.ColorManagement.enabled = false


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {

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


// Create a cube
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// scene.add(cube);

camera.position.z = 5;
camera.position.y = 1;
camera.position.x = 0;


const cameraPositions = {
    final: {
        x: 0,
        y: -0.5,
        z: 30
    },
    logo: {
        x: 0,
        y: 1.4,
        z: 20
    },
    gearOne: {
        x: 1.5,
        y: 5.73,
        z: -2
    },
    gearTwo: {
        x: -2.13,
        y: 6.35,
        z: 4.5
    },
    gearThree: {
        x: -4.73,
        y: 4.4,
        z: 4.5
    },
    gearFour: {
        x: -5.7,
        y: 1.15,
        z: 4.5
    },
    gearFive: {
        x: -4.56,
        y: -1.88,
        z: 4.5
    },
    gearSix: {
        x: -1.8,
        y: -3.83,
        z: 4.5
    },
    gearSeven: {
        x: 1.45,
        y: -3.61,
        z: 4.5
    },
}


// Loading Texture
const textureLoader = new THREE.TextureLoader()

let meshTexture = textureLoader.load('./assets/bakingText.jpg')
let earthTexture = textureLoader.load('./assets/diff/earthReal.jpg')

earthTexture.flipY = false
meshTexture.flipY = false
earthTexture.encoding = THREE.sRGBEncoding
meshTexture.encoding = THREE.sRGBEncoding


const meshMaterial = new THREE.MeshBasicMaterial({
    map: meshTexture,
    flatShading: false
})

const orangeMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#F05223') })
const greenMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#31B982') })
// orangeMaterial.side = THREE.DoubleSide

const outerEarthMaterial = new THREE.MeshBasicMaterial({
    map: earthTexture,
    transparent: true,
    flatShading: false
})
const innerEarthMaterial = new THREE.MeshBasicMaterial({
    map: earthTexture,
    transparent: true,
    flatShading: false
})

// Loading Object
const gltfLoader = new GLTFLoader();

const group = new THREE.Group()



let mixer = null
let clips;
var tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".main",
        start: "top+=10% top",
        end: "bottom bottom", // Adjust this to control the duration of the scroll effect
        // end: "+=400%", // Adjust this to control the duration of the scroll effect
        scrub: 2,
        // markers: true,   
    },
});
tl.timeScale(5);


let mesh, cone, fullEarth, gear, halfEarth, innerPot, innerPotBig, innerPotSmall, moon, moonGear, pot

const heading = document.querySelector('.heading')
const instruAbout = document.querySelector('.instruAbout')
const reach = document.querySelector('.reach')
const design = document.querySelector('.design')
const logo = document.querySelector('.logo')
console.log(instruAbout);



tl.to(camera.position, {
    x: -1,
    y: 0.1,
}, 'start')

tl.to(instruAbout, { opacity: 1, duration: 1 })
    .to(instruAbout, { opacity: 1, duration: 1 })
    .to(instruAbout, { opacity: 0, duration: 1 });
// tl.fromTo(instruAbout, { opacity: 1, time: 2, delay: 7 }, { opacity: 1 }, 'instruAbout1')
// tl.to(instruAbout, {opacity:0}, 'start1+=50%')
// tl.to(instruAbout, { opacity: 0, duration: 0.2 }, 'instruAbout2')

// tl.from(reach, { opacity: 0 }, 'start1+=70%')
// tl.to(reach, { opacity: 0 }, 'start2+=20%')
// tl.from(design, { opacity: 0 }, 'start3')
// tl.to(design, { opacity: 0 }, 'start3+=120%')

tl.to(camera.position, {
    z: 5,
    y: 1,
    x: 0,
}, 'start1')
// camera.position.z = 5;
// camera.position.y = 1;
// camera.position.x = 0;

// tl.to(camera.position, {x: -1, y: 0.6}, 'start+=50%')

gltfLoader.load(
    'assets/innerEarth.glb',
    // onLoad callback
    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = innerEarthMaterial
                // child.material.map = earthTexture
                child.material.needsUpdate = true
            }
        })
        gltf.scene.scale.set(0.11, 0.11, 0.11)
        scene.add(gltf.scene);
        mesh = gltf.scene
        mesh.position.x -= 0.05
        // tl.to(mesh.rotation, { duration: 0.2, y: 5, ease: "none" }, 'start');
        tl.to(mesh.rotation, { duration: 0.2, y: 6.5, ease: "none" }, 'start1');
        tl.to(mesh.children[0].material, { duration: 0.07, opacity: 0, ease: "none" }, 'start2');
    },
    // onProgress callback
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // onError callback
    (error) => {
        console.error('An error happened', error);
    }
);

let outerEarth;
gltfLoader.load(
    'assets/outerEarth.glb',
    // onLoad callback
    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = outerEarthMaterial
                child.material.needsUpdate = true
            }
        })

        outerEarth = gltf.scene
        console.log(mesh);
        gltf.scene.scale.set(0.1, 0.1, 0.1)
        scene.add(outerEarth);
        outerEarth.position.x -= 0.05

        // tl.to(outerEarth.rotation, { duration: 0.6, y: 5, ease: "none" }, 'start');
        tl.to(outerEarth.children[0].material, { duration: 0.1, opacity: 0, ease: "none" }, 'start1');

        tl.from(reach, { opacity: 0, duration: 1 })
        tl.to(reach, { opacity: 0, duration: 1 })
        console.log(mesh);
    },
    // onProgress callback
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // onError callback
    (error) => {
        console.error('An error happened', error);
    }
);



// gltfLoader.load(
//     'assets/diff/cone.glb',
//     // onLoad callback
//     (gltf) => {
//         gltf.scene.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = orangeMaterial
//                 child.material.needsUpdate = true
//             }
//         })

//         console.log(cone);
//         console.log(gltf.scene);
//         // gltf.scene.scale.set(0.1, 0.1, 0.1)

//         tl.from(gltf.scene.rotation, {
//             z: -6
//         }, 'cone')
//         tl.from(gltf.scene.position, {
//             x: 1,
//             y: -1
//         }, 'cone')
//         group.add(gltf.scene);

//     },
//     // onProgress callback
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     // onError callback
//     (error) => {
//         console.error('An error happened', error);
//     }
// );

// gltfLoader.load(
//     'assets/diff/gear.glb',
//     // onLoad callback
//     (gltf) => {
//         gltf.scene.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = orangeMaterial
//                 child.material.needsUpdate = true
//             }
//         })

//         gear = gltf.scene
//         console.log(gltf.scene);
//         // gltf.scene.scale.set(0.1, 0.1, 0.1)
//         group.add(gltf.scene);

//         tl.from(gltf.scene.rotation, {
//             y: 12
//         }, 'cone')

//     },
//     // onProgress callback
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     // onError callback
//     (error) => {
//         console.error('An error happened', error);
//     }
// );

// gltfLoader.load(
//     'assets/diff/innerPot.glb',
//     // onLoad callback
//     (gltf) => {
//         gltf.scene.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = greenMaterial
//                 child.material.needsUpdate = true
//             }
//         })

//         innerPot = gltf.scene
//         console.log(gltf.scene);
//         // gltf.scene.scale.set(0.1, 0.1, 0.1)

//         group.add(gltf.scene);

//     },
//     // onProgress callback
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     // onError callback
//     (error) => {
//         console.error('An error happened', error);
//     }
// );

// gltfLoader.load(
//     'assets/diff/innerPotBig.glb',
//     // onLoad callback
//     (gltf) => {
//         gltf.scene.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = greenMaterial
//                 child.material.needsUpdate = true
//             }
//         })

//         innerPotBig = gltf.scene
//         console.log(gltf.scene);
//         // gltf.scene.scale.set(0.1, 0.1, 0.1)
//         group.add(gltf.scene);

//     },
//     // onProgress callback
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     // onError callback
//     (error) => {
//         console.error('An error happened', error);
//     }
// );

// gltfLoader.load(
//     'assets/diff/innerPotSmall.glb',
//     // onLoad callback
//     (gltf) => {
//         gltf.scene.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = greenMaterial
//                 child.material.needsUpdate = true
//             }
//         })

//         innerPotSmall = gltf.scene
//         console.log(gltf.scene);
//         // gltf.scene.scale.set(0.1, 0.1, 0.1)
//         group.add(gltf.scene);

//     },
//     // onProgress callback
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     // onError callback
//     (error) => {
//         console.error('An error happened', error);
//     }
// );

// gltfLoader.load(
//     'assets/diff/moon.glb',
//     // onLoad callback
//     (gltf) => {
//         gltf.scene.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = orangeMaterial
//                 child.material.needsUpdate = true
//             }
//         })

//         moon = gltf.scene

//         console.log(gltf.scene);
//         // gltf.scene.scale.set(0.1, 0.1, 0.1)
//         group.add(gltf.scene);
//         tl.from(gltf.scene.rotation, {
//             z: -6,
//         }, 'cone')

//     },
//     // onProgress callback
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     // onError callback
//     (error) => {
//         console.error('An error happened', error);
//     }
// );

// gltfLoader.load(
//     'assets/diff/moonGear.glb',
//     // onLoad callback
//     (gltf) => {
//         gltf.scene.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = orangeMaterial
//                 child.material.needsUpdate = true
//             }
//         })

//         moonGear = gltf.scene
//         console.log(gltf.scene);
//         // gltf.scene.scale.set(0.1, 0.1, 0.1)
//         group.add(gltf.scene);
//         tl.from(gltf.scene.rotation, {
//             x: -12,
//             y: -12,
//             z: 6,
//         }, 'cone')

//     },
//     // onProgress callback
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     // onError callback
//     (error) => {
//         console.error('An error happened', error);
//     }
// );

// gltfLoader.load(
//     'assets/diff/pot.glb',
//     // onLoad callback
//     (gltf) => {
//         gltf.scene.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = greenMaterial
//                 child.material.needsUpdate = true
//             }
//         })

//         pot = gltf.scene.clone()
//         console.log(gltf.scene);
//         // gltf.scene.scale.set(0.1, 0.1, 0.1)
//         group.add(gltf.scene);

//     },
//     // onProgress callback
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     // onError callback
//     (error) => {
//         console.error('An error happened', error);
//     }
// );

gltfLoader.load(
    'assets/diff/model3.glb',
    // onLoad callback
    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                if (child.name == 'innerPot' || child.name == 'pot' || child.name == 'innerPotSmall' || child.name == 'innerPotBig') {
                    console.log(child.name);
                    child.material = greenMaterial
                } else {

                    child.material = orangeMaterial
                }
                child.material.needsUpdate = true
            }
        })
        gltf.scene.scale.set(20, 20, 20)
        gltf.scene.position.y = -2
        console.log(gltf);
        mixer = new THREE.AnimationMixer(gltf.scene)
        mixer.clampWhenFinished = true
        clips = gltf.animations;
        console.log(clips);


        const innerPotAction = mixer.clipAction(clips[3]);
        innerPotAction.setDuration(5)
        innerPotAction.setLoop(THREE.LoopOnce);
        innerPotAction.clampWhenFinished = true;
        innerPotAction.play();
        innerPotAction.paused = true
        // innerPotAction.setDuration(7);
        tl.to(innerPotAction, { time: 6.25, ease: "none", duration: 2 }, 'start1');
        tl.to(camera.position, { z: 9, y: 0.6, ease: "none", }, 'start1');


        // tl.to(innerPotAction, { time: 3, ease: "none" }, 'start');
        // const innerPotMesh = gltf.scene.children[5]
        // tl.to(innerPotMesh.rotation, { y: 2, ease: "none" }, 'start1');
        // innerPotMesh.scale.set(1.1, 1.1, 1.1)

        // tl.fromTo(camera.position, { z: 5, ease: "none" }, { z: 7 }, 'start');


        const insidePotBigAction = mixer.clipAction(clips[4]);
        insidePotBigAction.setLoop(THREE.LoopOnce);
        insidePotBigAction.clampWhenFinished = true;
        insidePotBigAction.play();
        // insidePotBigAction.setDuration(5);
        insidePotBigAction.paused = true
        tl.to(insidePotBigAction, { time: 6.25, ease: "none", duration: 2 }, 'start1+=70%');

        // tl.to(insidePotBigAction, { time: 1, ease: "none" }, 'start1');
        // tl.to(camera.position, { z: 7.5, ease: "none" }, 'start1');

        const insidePotSmallAction = mixer.clipAction(clips[5]);
        insidePotSmallAction.setLoop(THREE.LoopOnce);
        insidePotSmallAction.clampWhenFinished = true;
        insidePotSmallAction.play();
        // insidePotSmallAction.setDuration(7);
        insidePotSmallAction.paused = true
        tl.to(insidePotSmallAction, { time: 6.25, ease: "none", duration: 2 }, 'start1+=50%');
        tl.from(design, { opacity: 0, duration: 1 })
        tl.to(design, { opacity: 0, duration: 1 })
        // tl.to(camera.position, { z: 8, ease: "none" }, 'start1');


        const gearAction = mixer.clipAction(clips[2]);
        gearAction.setLoop(THREE.LoopOnce);
        gearAction.clampWhenFinished = true;
        gearAction.play();
        gearAction.setDuration(7); 
        gearAction.paused = true
        tl.to(gearAction, { time: 6.25, ease: "none", duration: 2 }, 'start2');
        tl.to(camera.position, { z: 9, y: 0.6, ease: "none" }, 'start2');



        const potAction = mixer.clipAction(clips[6]);
        potAction.setLoop(THREE.LoopOnce);
        potAction.clampWhenFinished = true;
        potAction.play();
        // potAction.setDuration(7);
        potAction.paused = true
        tl.to(potAction, { time: 6.25, ease: "none", duration: 2 }, 'start2+=150%');
        tl.to(camera.position, { z: 12, ease: "none" }, 'start2+=150%');

        const moonAction = mixer.clipAction(clips[0]);
        moonAction.setLoop(THREE.LoopOnce);
        moonAction.clampWhenFinished = true;
        moonAction.play();
        // moonAction.setDuration(5);
        moonAction.paused = true
        tl.to(moonAction, { time: 6.25, ease: "none", duration: 2 }, 'cone');
        tl.to(camera.position, { z: 15, ease: "none" }, 'cone');

        const moonGearAction = mixer.clipAction(clips[7]);
        moonGearAction.setLoop(THREE.LoopOnce);
        moonGearAction.clampWhenFinished = true;
        moonGearAction.play();
        // moonGearAction.setDuration(6.25);
        moonGearAction.paused = true
        tl.to(moonGearAction, { time: 6.25, ease: "none", duration: 2 }, 'cone');
        tl.to(camera.position, { z: 17, y: 1.4, ease: "none" }, 'cone');


        const coneAction = mixer.clipAction(clips[1]);
        coneAction.setLoop(THREE.LoopOnce);
        coneAction.clampWhenFinished = true;
        coneAction.play();
        // coneAction.setDuration(6.25);
        coneAction.paused = true
        tl.to(coneAction, { time: 6.25, ease: "none", duration: 2 }, 'cone');
        tl.to(camera.position, { x: cameraPositions.final.x, y: cameraPositions.final.y, z: cameraPositions.final.z, ease: "none" }, 'logoReveal');
        tl.from(logo, { y: 200 }, 'logoReveal')
        tl.to(logo, { opacity: 0, delay: 1 }, 'logoHide')
        tl.to(camera.position, { x: cameraPositions.logo.x, y: cameraPositions.logo.y, z: cameraPositions.logo.z, ease: "none", duration: 2, }, 'logoHide')




        group.add(gltf.scene);


        // gltf.scene.scale.set(0.1, 0.1, 0.1)
    },
    // onProgress callback
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // onError callback
    (error) => {
        console.error('An error happened', error);
    }
);


let textTexture = textureLoader.load('./assets/text.png')
textTexture.flipY = false
textTexture.encoding = THREE.sRGBEncoding
const textMaterial = new THREE.MeshBasicMaterial({ transparent: true, map: textTexture })


gltfLoader.load(
    'assets/text.glb',
    // onLoad callback
    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = textMaterial
                child.material.needsUpdate = true
            }
        })
        gltf.scene.position.y = -2
        gltf.scene.scale.set(20, 20, 20)
        scene.add(gltf.scene);
        gsap.set(gltf.scene.children[0].material, { opacity: 0 })
        tl.fromTo(gltf.scene.children[0].material, { opacity: 0 }, { opacity: 1 }, 'logoHide')
        tl.to(camera.position, {
            x: cameraPositions.gearOne.x,
            y: cameraPositions.gearOne.y,
            z: cameraPositions.gearOne.z,
            delay: 2
        })

        gsap.set('.shutter', { opacity: 0,})

        const shutterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#sec3',
                start: 'center center',
                scrub: 0.5,
            },

        })

        tl.to('.shutter', {
            opacity: 1,
            duration: 0.1
        })
        tl.to('.shutter', {
            y: -1000,
            duration: 2,
            delay: 1
        })


    },
    // onProgress callback
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // onError callback
    (error) => {
        console.error('An error happened', error);
    }
);


console.log(group);
scene.add(group)


const clock = new THREE.Clock()
let previousTime = 0

// Define a function to animate the cube
// function animate() {
//     const elapsedTime = clock.getElapsedTime()
//     const deltaTime = elapsedTime - previousTime
//     previousTime = elapsedTime

//     requestAnimationFrame(animate);
//     if (mixer !== null) {
//         mixer.update(deltaTime)
//     }

//     renderer.render(scene, camera);
// }

// // Call the animate function to start the animation
// animate();



const pressureScene = new THREE.Scene()
const pressureCamera = new THREE.PerspectiveCamera(19, window.innerWidth / window.innerHeight, 0.1, 1000);
// const pressureCamera = new THREE.OrthographicCamera(500, 500, 200, 200, 1, 1000)
pressureCamera.position.z = 4
pressureCamera.position.y = 0.7
pressureCamera.rotation.x -= 0.05

// const ambientLight = new THREE.AmbientLight('#ffffff', 10)
// const directionLight = new THREE.DirectionalLight('#ffffff', 10)
// pressureScene.add(ambientLight)
// pressureScene.add(directionLight)
// directionLight.position.y = 3


let planeTexture = textureLoader.load('public/assets/textures/wood_planks_diff_1k.jpg')
planeTexture.repeat.set(4, 4);
planeTexture.wrapT = THREE.RepeatWrapping
planeTexture.wrapS = THREE.RepeatWrapping
const planeMaterial = new THREE.MeshBasicMaterial({ transparent: true, map: planeTexture })

let floorTexture = textureLoader.load('public/assets/Store_uv.png')
floorTexture.flipY = false
floorTexture.encoding = THREE.sRGBEncoding
const platformMaterial = new THREE.MeshBasicMaterial({ transparent: true, map: floorTexture })
const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), planeMaterial)
pressureScene.add(planeMesh)
planeMesh.rotation.x = -Math.PI / 2
planeMesh.rotation.z = -Math.PI / 2
planeMesh.position.y = 0.08
planeMesh.scale.set(4, 4, 4)



gltfLoader.load(
    'assets/platform/platform.glb',
    // onLoad callback
    (gltf) => {
        gltf.scene.traverse((child) => {
            console.log(child.name);
            if (child.name == 'bg') {
                child.scale.set(0.9, 0.9, 0.9)
                child.position.y -= 0.2
                // child.material = bgMaterial
                child.material.needsUpdate = true
            } else if (child.name == 'pCube1' || child.name == 'pCube9') {
                child.material = planeMaterial
                child.material.needsUpdate = true

            }
            else if (child.name == 'pCylinder1' || child.name == 'pCylinder2' || child.name == 'pCylinder3' || child.name == 'pCylinder4' || child.name == 'pCylinder5') {
                child.material = platformMaterial
                child.material.needsUpdate = true
            }
            // if (child.isMesh) {

            // }
            if (child.isMesh) {
                child.material = platformMaterial
                child.material.needsUpdate = true
                console.log('material updated');
            }
        })

        console.log(gltf.scene);
        // gltf.scene.scale.set(0.1, 0.1, 0.1)
        pressureScene.add(gltf.scene);

    },
    // onProgress callback
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // onError callback
    (error) => {
        console.error('An error happened', error);
    }
);


let currentScene = scene;
let currentCamera = camera



let frustumSize = 1
const scene3 = new THREE.Scene();
const camera3 = new THREE.OrthographicCamera(frustumSize / -2, frustumSize / 2, frustumSize / 2, frustumSize / -2, -1000, 1000)

function vertexShader() {
    return `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `
}

function fragmentShader() {
    return `
    uniform float time;
    uniform float progress;
    uniform sampler2D scene1;
    uniform sampler2D scene2;
    uniform vec4 resolution;
    varying vec2 vUv;
    varying vec3 vPosition;
    float PI = 3.14;

    vec2 distort(vec2 olduv, float pr, float expo){
        vec2 p0 = 2. * olduv -1.;
        vec2 p1 = p0/(1. - pr*length(p0)*expo);
        return (p1 + 1.)*0.5;
    }


    void main(){
        float progress1 = smoothstep(0.75, 1., progress);

        vec2 uv1 = distort(vUv, -10.*(progress), progress*4.);
        vec2 uv2 = distort(vUv, -10.*(1. - progress), progress*4.);

        vec4 s1 = texture2D(scene1,uv1);
        vec4 s2 = texture2D(scene2,uv2);

        float mixer = progress1;
        gl_FragColor = vec4(vUv, 0.0, 1.);
        gl_FragColor = s1;

        vec4 finalTexture = mix(s1, s2, mixer);
        gl_FragColor = finalTexture;
    }

    `
}

let settings = {
    progress: 0
}


// const gui = new GUI()
// gui.add(settings, 'progress', 0, 1, 0.01)

let scene1Texture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
let scene2Texture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)

let shaderMaterial = new THREE.ShaderMaterial({
    extensions: {
        derivatives: "extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
        progress: { value: 0 },
        resulution: { value: new THREE.Vector4() },
        scene1: { value: null },
        scene2: { value: null }
    },
    // uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader(),
})
let geo = new THREE.PlaneGeometry(1, 1)
let mesh1 = new THREE.Mesh(geo, shaderMaterial)

scene3.add(mesh1)

// gsap.to(camera.position,{
//     scrollTrigger:{
//         trigger: '.gear0',
//         markers: true,
//         scrub: true,
//         start: 'top top',
//         end: 'center center'
//     },
//     x: cameraPositions.gearOne.x,
//     y: cameraPositions.gearOne.y,
//     z: cameraPositions.gearOne.z,
//     duration: 1
// })

gsap.to(settings, {
    scrollTrigger: {
        trigger: '.triggerSceneChange',
        // markers: true,
        scrub: true,
        start: 'top bottom',
        end: 'top bottom'
    },
    progress: 1,
    duration: 0.1
})


// gsap.set('.shutter', { opacity: 0 })

// const shutterTimeline = gsap.timeline({
//     scrollTrigger: {
//         trigger: '#sec3',
//         start: 'center center',
//         scrub: 0.5,
//     },

// })

// shutterTimeline.to('.shutter', {
//     opacity: 1,
//     duration: 0.1
// })
// shutterTimeline.to('.shutter', {
//     y: -1000,
//     duration: 2,
//     delay: 1
// })


gsap.set('.pressureDivs', { opacity: 0 })

gsap.to('.pressureDivs', {
    scrollTrigger: {
        trigger: '.triggerSceneChange',
        scrub: true,
        start: 'top bottom',
        end: 'top bottom'
    },
    opacity: 1,
    duration: 0.1
})






//Earth animation
gsap.ticker.add((time) => {

    lenis.raf(time * 1000)

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if (outerEarth) {
        outerEarth.rotation.y += deltaTime * 0.2
    }

    if (mixer !== null) {
        mixer.update(deltaTime)
    }
    // renderer.render(scene, camera);
    renderer.setRenderTarget(scene1Texture)
    renderer.render(scene, camera)

    renderer.setRenderTarget(scene2Texture)
    renderer.render(pressureScene, pressureCamera)

    shaderMaterial.uniforms.scene1.value = scene1Texture.texture
    shaderMaterial.uniforms.scene2.value = scene2Texture.texture
    shaderMaterial.uniforms.progress.value = settings.progress
    renderer.setRenderTarget(null)
    renderer.render(scene3, camera3);

});
