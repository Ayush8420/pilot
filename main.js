import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from "gsap"
import { GUI } from 'dat.gui'



gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)



const lenis = new Lenis({ duration: 5 })
lenis.on('scroll', ScrollTrigger.update)


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
THREE.ColorManagement.enabled = false


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {


    sizes.width = window.innerWidth
    sizes.height = window.innerHeight


    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()


    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


camera.position.z = 7;
camera.position.y = 1;
camera.position.x = 0;


const cameraPositions = {
    final: {
        x: 0,
        y: -1.1,
        z: 35
    },
    logo: {
        x: 0,
        y: 2.3,
        z: 29
    },
    gearOne: {
        x: -2.2,
        y: 9,
        z: -1
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


const textureLoader = new THREE.TextureLoader()

let meshTexture = textureLoader.load('./assets/bakingText.jpg')
let earthTexture = textureLoader.load('./assets/diff/earthTexture.jpeg')
let innerEarthTexture = textureLoader.load('./assets/diff/Frame 1.jpg')
earthTexture.flipY = false
innerEarthTexture.flipY = false
meshTexture.flipY = false
earthTexture.encoding = THREE.sRGBEncoding
meshTexture.encoding = THREE.sRGBEncoding


const meshMaterial = new THREE.MeshBasicMaterial({
    map: meshTexture,
    flatShading: false
})

const orangeMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#F05223') })
const greenMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#31B982') })

const outerEarthMaterial = new THREE.MeshBasicMaterial({
    map: earthTexture,
    transparent: true,
    flatShading: false
})

const innerEarthMaterial = new THREE.MeshBasicMaterial({
    map: innerEarthTexture,
    transparent: true,
    flatShading: false,
})

const gltfLoader = new GLTFLoader();

const group = new THREE.Group()



let mixer = null
let clips;
var tl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 5,

    },
});

tl.timeScale(0.5);


let mesh, cone, fullEarth, gear, halfEarth, innerPot, innerPotBig, innerPotSmall, moon, moonGear, pot

const heading = document.querySelector('.heading')
const instruAbout = document.querySelector('.instruAbout')
const reach = document.querySelector('.reach')
const design = document.querySelector('.design')
const logo = document.querySelector('.logo')
const sec2 = document.querySelector(".sec2")
console.log(instruAbout);


//Earth to the  right
tl.to(camera.position, {
    x: -2.2,
    y: 0.2,
    z: 7,
    duration: 900,
}, 'start')

tl.to(heading,
    {
        scrollTrigger: {
            trigger: ".main",
            start: "top top",
            end: "bottom top",
            scrub: 1,
        },
        x: "100%",
        duration: 3
    })


tl.to(instruAbout, { opacity: 1, duration: 100 }, "start+=500")
    .to(instruAbout, { opacity: 1, duration: 600 })
    .to(instruAbout, { opacity: 0, duration: 100 });


// tl.to(camera.position, {
//     z: 19,
//     y: 1,
//     x: 0,
//     duration: 3,
// }, 'start1')



//inner  earth

gltfLoader.load(
    'assets/innerEarth.glb',

    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = innerEarthMaterial

                child.material.needsUpdate = true
            }
        })
        gltf.scene.scale.set(0.15, 0.15, 0.15)
        scene.add(gltf.scene);
        mesh = gltf.scene
        // mesh.position.x += 0.42
        mesh.position.y -= 0.1
        mesh.position.z -= 1
        // mesh.position.z -= 5.3
        mesh.rotation.y = 1 * Math.PI

        tl.to(mesh.rotation, { duration: 560, y: 2 * Math.PI, ease: "none", delay: 5 }, 'start1');
        tl.to(mesh.position,{y: 0.05, x: .3, duration: 900},"start")
        tl.to(mesh.position,{ x: 0, duration: 560},"start1")
        tl.to(mesh.children[0].material, { duration: 150, opacity: 0, ease: "none", delay: -1 }, 'start2');
    },

    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    (error) => {
        console.error('An error happened', error);
    }
);


//outer earth
let outerEarth;

gltfLoader.load(
    'assets/outerEarth.glb',

    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = outerEarthMaterial
                child.material.needsUpdate = true
            }
        })

        outerEarth = gltf.scene
        console.log(mesh)
        gltf.scene.scale.set(0.12, 0.12, 0.12)
        scene.add(outerEarth);
        // outerEarth.position.x -= 0.05

        // mesh.position.z -= 1



        // Earth to center with small appearence

        tl.to(outerEarth.rotation, { y: 5, duration: 900, }, "start")

        tl.to(camera.position, {
            z: 7,
            y: 0,
            x: 0,
            duration: 700,
        }, 'start1')

        tl.to(outerEarth.children[0].material, { duration: 1, opacity: 0, ease: "none" }, 'start1');

        // tl.from(reach, { opacity: 0, duration: 1 })
        // tl.to(reach, { opacity: 0, duration: 1 })
        //         console.log(mesh);
    },

    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    (error) => {
        console.error('An error happened', error);
    }
);


//outer animation
let model3;
gltfLoader.load(
    'assets/diff/model3.glb',
    // onLoad callback
    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                if (child.name == 'innerPot' || child.name == 'pot' || child.name == 'innerPotSmall' || child.name == 'innerPotBig') {
                    console.log("tests:", child.name);
                    child.material = greenMaterial

                    if (child.name == 'innerPotSmall' || child.name == 'innerPotBig') {
                        child.scale.x = 2
                        child.scale.y = 2
                        child.scale.z = 2
                        child.translateY += 20
                        console.log("Scale", child.scale)
                    }
                }
                else {

                    child.material = orangeMaterial
                }
                child.material.needsUpdate = true
            }
        })
        gltf.scene.scale.set(35, 35, 35)
        gltf.scene.position.y = -3.5;
        gltf.scene.position.z = -2.05

        
        model3 = gltf.scene
        tl.to(model3.position,{y: -3.45, x: .5, duration: 900},"start")
        
        console.log(gltf);
        mixer = new THREE.AnimationMixer(gltf.scene)
        mixer.clampWhenFinished = true
        clips = gltf.animations;
        console.log(clips);



        const innerPotAction = mixer.clipAction(clips[3]);
        innerPotAction.setDuration(5)
        innerPotAction.setLoop(THREE.LoopOnce);
        innerPotAction.repetitions = 2
        innerPotAction.clampWhenFinished = true;
        innerPotAction.play();
        innerPotAction.paused = true
        // innerPotAction.setDuration(7);





        const insidePotBigAction = mixer.clipAction(clips[4]);
        insidePotBigAction.setLoop(THREE.LoopOnce);
        insidePotBigAction.clampWhenFinished = true;
        insidePotBigAction.play();
        // insidePotBigAction.setDuration(5);
        insidePotBigAction.paused = true



        const insidePotSmallAction = mixer.clipAction(clips[5]);
        insidePotSmallAction.setLoop(THREE.LoopOnce);
        insidePotSmallAction.clampWhenFinished = true;
        insidePotSmallAction.play();
        insidePotSmallAction.paused = true


        const gearAction = mixer.clipAction(clips[2]);
        gearAction.setLoop(THREE.LoopOnce);
        gearAction.clampWhenFinished = true;
        gearAction.play();
        gearAction.setDuration(10);
        gearAction.paused = true


        tl.to(model3.position,{y: -3.5, x: 0, duration: 800},"start1")

        tl.to(innerPotAction, { time: 6.25, ease: "none", duration: 800 }, 'start1')
            .to(insidePotBigAction, { time: 6.25, ease: "none", duration: 200, delay: 100 })
            .to(insidePotSmallAction, { time: 6.25, ease: "none", duration: 200, delay: 100 })
            .to(reach, { opacity: 1, duration: 60, delay: 100 })
            .to(reach, { opacity: 0, duration: 60, delay: 1000 })
            .to(gearAction, { time: 6.25, ease: "none", duration: 1500, delay: 1600 }, 'start2')
            .to(camera.position, { z: 12, y: 0, ease: "none", duration: 600 })
            .to(design, { opacity: 1, duration: 50, delay: 100 })
            .to(design, { opacity: 0, duration: 50, delay: 500 }, "start3")




        const potAction = mixer.clipAction(clips[6]);
        potAction.setLoop(THREE.LoopOnce);
        potAction.clampWhenFinished = true;
        potAction.play();
        potAction.paused = true




        tl.to(potAction, { time: 6.25, ease: "none", duration: 600, delay: 1600 }, 'start3')
            .to(camera.position, { z: 22, ease: "none", duration: 600, delay: 100 });

        


        const moonAction = mixer.clipAction(clips[0]);
        moonAction.setLoop(THREE.LoopOnce);
        moonAction.clampWhenFinished = true;
        moonAction.play();
        moonAction.paused = true
        tl.to(moonAction, { time: 6.25, ease: "none", duration: 900 }, 'cone')
            .to(camera.position, { z: 30, ease: "none", duration: 900 }, 'cone');

            
        tl.fromTo(innerPotAction, {time : 0},{ time:2* 6.25, ease: "none", duration: 5000, delay: -1000}, "cone")


        const moonGearAction = mixer.clipAction(clips[7]);
        moonGearAction.setLoop(THREE.LoopOnce);
        moonGearAction.clampWhenFinished = true;
        moonGearAction.play();
        moonGearAction.paused = true
        tl.to(moonGearAction, { time: 6.25, ease: "none", duration: 900 }, 'cone');
        // tl.to(camera.position, { z: 30, y: 1.4, ease: "none", duration: 20 }, 'cone');



        const coneAction = mixer.clipAction(clips[1]);
        coneAction.setLoop(THREE.LoopOnce);
        coneAction.clampWhenFinished = true;
        coneAction.play();
        coneAction.paused = true
        tl.to(coneAction, { time: 6.25, ease: "none", duration: 900 }, 'cone');

        tl.to(sec2, { opacity: 1, duration: 5 }, "cone+=10")


        tl.to(camera.position, { x: cameraPositions.final.x, y: cameraPositions.final.y, z: cameraPositions.final.z, duration: 500 }, 'logoReveal');
        tl.from(logo, { y: 200, duration: 500 }, 'logoReveal')
        tl.to(sec2, { opacity: 0, duration: 1, delay: 30 }, "logoReveal")
            .to(logo, { backgroundColor: "#00000000" })

        tl.to(logo, { y: 200, delay: 15, duration: 500, delay: 500 }, 'logoHide')
        tl.to(camera.position, { x: cameraPositions.logo.x, y: cameraPositions.logo.y, z: cameraPositions.logo.z, ease: "none", duration: 500, }, 'logoHide+=500')




        group.add(gltf.scene);

    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('An error happened', error);
    }
);


let textTexture = textureLoader.load('./assets/text.png')
textTexture.flipY = false
textTexture.encoding = THREE.sRGBEncoding
const textMaterial = new THREE.MeshBasicMaterial({ transparent: true, map: textTexture })



// no idea
gltfLoader.load(
    'assets/text.glb',

    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = textMaterial
                child.material.needsUpdate = true
            }
        })
        gltf.scene.position.y = -3.05
        gltf.scene.scale.set(33, 33, 33)
        scene.add(gltf.scene);
        gsap.set(gltf.scene.children[0].material, { opacity: 0 })
        tl.to(gltf.scene.children[0].material, { opacity: 1, duration: 600, delay: 600 }, 'logoHide+=10')
            .to(camera.position, {
                x: cameraPositions.gearOne.x,
                y: cameraPositions.gearOne.y,
                z: cameraPositions.gearOne.z,
                delay: 1300,
                duration: 1000,
            }, "gear1")

        tl.to(model3.rotation, { z: .3, delay: 1300, duration: 1000, }, "gear1")
        tl.to(gltf.scene.rotation, { z: .3, delay: 1300, duration: 1000, }, "gear1")

        // gsap.set('.shutter', { opacity: 0,}) 

        const shutterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#sec3',
                start: 'center center',
                scrub: 0.5,
            },

        })

        // tl.to('.shutter', {
        //     opacity: 1,
        //     duration: 0.1
        // })
        // tl.to('.shutter', {
        //     y: -1000,
        //     duration: 2,
        //     delay: 1
        // })
    },

    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    (error) => {
        console.error('An error happened', error);
    }
);


console.log(group);
scene.add(group);


const clock = new THREE.Clock()
let previousTime = 0

const pressureScene = new THREE.Scene()

const pressureCamera = new THREE.PerspectiveCamera(19, window.innerWidth / window.innerHeight, 0.1, 1000);
pressureCamera.position.z = 4
pressureCamera.position.y = 0.7
pressureCamera.rotation.x -= 0.05

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


/*
// Background platform
gltfLoader.load(
    'assets/platform/platform.glb',

    (gltf) => {
        gltf.scene.traverse((child) => {
            console.log(child.name);
            if (child.name == 'bg') {
                child.scale.set(0.9, 0.9, 0.9)
                child.position.y -= 0.2
            
                child.material.needsUpdate = true
            } else if (child.name == 'pCube1' || child.name == 'pCube9') {
                child.material = planeMaterial
                child.material.needsUpdate = true

            }
            else if (child.name == 'pCylinder1' || child.name == 'pCylinder2' || child.name == 'pCylinder3' || child.name == 'pCylinder4' || child.name == 'pCylinder5') {
                child.material = platformMaterial
                child.material.needsUpdate = true
            }
        

        
            if (child.isMesh) {
                child.material = platformMaterial
                child.material.needsUpdate = true
                console.log('material updated');
            }
        })

        console.log(gltf.scene);
    
        pressureScene.add(gltf.scene);

    },

    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    (error) => {
        console.error('An error happened', error);
    }
);*/


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

    fragmentShader: fragmentShader(),
    vertexShader: vertexShader(),
})
let geo = new THREE.PlaneGeometry(1, 1)
let mesh1 = new THREE.Mesh(geo, shaderMaterial)

scene3.add(mesh1)


// gsap.to(settings, {
//     scrollTrigger: {
//         trigger: '.triggerSceneChange',
//         scrub: true,
//         start: 'top bottom',
//         end: 'top bottom'
//     },
//     progress: 1,
//     duration: 0.1
// })

// gsap.set('.pressureDivs', { opacity: 0 })

// gsap.to('.pressureDivs', {
//     scrollTrigger: {
//         trigger: '.triggerSceneChange',
//         scrub: true,
//         start: 'top bottom',
//         end: 'top bottom'
//     },
//     opacity: 1,
//     duration: 0.1
// })


// settimeout
gsap.ticker.add((time) => {

    lenis.raf(time * 1000)

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // if (outerEarth) {
    //     outerEarth.rotation.y += deltaTime * 0.2
    // }

    if (mixer !== null) {
        mixer.update(deltaTime)
    }

    renderer.setRenderTarget(scene1Texture)
    renderer.render(scene, camera)

    // renderer.setRenderTarget(scene2Texture)
    // renderer.render(pressureScene, pressureCamera)

    shaderMaterial.uniforms.scene1.value = scene1Texture.texture
    shaderMaterial.uniforms.scene2.value = scene2Texture.texture
    shaderMaterial.uniforms.progress.value = settings.progress
    renderer.setRenderTarget(null)
    renderer.render(scene3, camera3);

});