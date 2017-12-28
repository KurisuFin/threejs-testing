let renderer, scene;
let clock, delta;
let tween;
let tick = 0;


function addLights() {
    // let ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.9 );
    // scene.add( ambientLight );

    let ambientLight = new THREE.AmbientLight(0x111111);
    let light = new THREE.DirectionalLight(0xFFFFFF, 0.9);
    light.position.set(200, 400, 500);
    let light2 = new THREE.DirectionalLight(0xFFFFFF, 0.9);
    light2.position.set(-500, 250, -200);
    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);
}


let santa = {
    hand: null,
    face: null,
    faceWireFrame: null,
    rightEye: null,
};

let leftEye, rightEye, leftLens, rightLens;

class FacePart {
    constructor(geometry, material, name) {
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = name;
        this.mesh.rotation.order = 'YXZ';

        this.wireframe = null;
        this.rightSide = false;
    }

    addEdges() {
        let geo = new THREE.EdgesGeometry(this.mesh.geometry);
        let mat = new THREE.LineBasicMaterial({color: 0x000000});
        this.wireframe = new THREE.LineSegments(geo, mat);
        this.mesh.add(this.wireframe);
    }

    setRightSide() {
        this.rightSide = !this.rightSide;
    }

    recreate(geometry) {
        // this.mesh.geometry = new this.mesh.geometry.constructor(radius, 16, 16);
        this.mesh.geometry = geometry;

        if (this.wireframe) {
            this.setWireframeVisibility(false);
            this.addEdges();
        }
    }

    setWireframeVisibility(visible) {
        if (this.wireframe) {
            this.wireframe.visible = visible;
        }
    }

    calculatePosition(bulge, height, spread) {
        let s = degToRad(height);
        let t = degToRad(spread);
        this.mesh.position.x = bulge * Math.sin(t) * Math.cos(s);
        this.mesh.position.y = bulge * Math.sin(s);
        this.mesh.position.z = bulge * Math.cos(t) * Math.cos(s);

        if (this.rightSide) {
            this.mesh.position.x *= -1;
        }
    }

    calculateRotation(height, spread) {
        this.mesh.rotation.x = degToRad(-eyeControls.height + 90);
        this.mesh.rotation.y = degToRad(eyeControls.spread);
        this.mesh.rotation.z = 0;

        if (this.rightSide) {
            this.mesh.rotation.y *= -1;
        }
    }
}


function createSanta() {
    createSantaHand();
    createFace();
    createEyes();
    scene.add(santa.hand);
}


function createSantaHand() {
    santa.hand = new THREE.Object3D();
}


// Eyes:

function createEyes() {
    let ballGeometry = createEyeBallGeometry();

    let loader = new THREE.TextureLoader();
    loader.load('img/flag.png');


    // let material = new THREE.MeshBasicMaterial({color: 0xf9f9f9});
    let material = new THREE.MeshBasicMaterial();
    let lensGeometry = createEyeLensGeometry();
    let lensMaterial = new THREE.MeshBasicMaterial({color: 0x111111});

    leftEye = new FacePart(ballGeometry, material);
    leftEye.addEdges();
    santa.leftEye = new THREE.Object3D();
    santa.leftEye.add(leftEye.mesh);
    santa.hand.add(santa.leftEye);

    leftLens = new FacePart(lensGeometry, lensMaterial);
    santa.leftEye.add(leftLens.mesh);

    rightEye = new FacePart(ballGeometry, material);
    rightEye.setRightSide();
    rightEye.addEdges();
    santa.rightEye = new THREE.Object3D();
    santa.rightEye.add(rightEye.mesh);
    santa.hand.add(santa.rightEye);

    rightLens = new FacePart(lensGeometry, lensMaterial);
    rightLens.setRightSide();
    santa.rightEye.add(rightLens.mesh);

    moveEyes();
}


function createEyeBallGeometry() {
    return new THREE.SphereGeometry(
        eyeControls.radius, eyeControls.widthSegments, eyeControls.heightSegments,
        undefined, undefined, undefined, eyeControls.thetaLength);
}


function createEyeLensGeometry() {
    let thetaLength = Math.sin(tick / 50) / 4 + 1/2;
    return new THREE.SphereGeometry(
        eyeControls.radius, eyeControls.widthSegments, eyeControls.heightSegments,
        undefined, undefined, undefined, thetaLength);
}


// Face:

function createFace() {
    let geometry = new THREE.SphereGeometry(100, 32, 32);
    let material = new THREE.MeshBasicMaterial({color: 0xffe0bd});
    let sphere = new THREE.Mesh(geometry, material);
    santa.faceWireFrame = addEdges(sphere);

    sphere.position.y = 0;
    sphere.position.z = 0;

    santa.face = sphere;
    santa.hand.add(sphere);
}


function addEdges(mesh) {
    let geo = new THREE.EdgesGeometry(mesh.geometry);
    let mat = new THREE.LineBasicMaterial({color: 0x000000});
    let wireframe = new THREE.LineSegments(geo, mat);
    mesh.add(wireframe);
    return wireframe;
}


// Controls:

let santaControls, eyeControls;

function setupControls(gui) {
    santaControls = {
        wireframe: false,
        px: 0,
        py: 120,
        pz: 0,
        rx: 0,
        ry: 0,
        rz: 0,
    };
    let folder1 = gui.addFolder('Santa controls');
    folder1.add(santaControls, 'wireframe', 1, 32).name('WireFrame');
    folder1.add(santaControls, 'px', -300, 300).name('Position X');
    folder1.add(santaControls, 'py', -300, 300).name('Position Y');
    folder1.add(santaControls, 'pz', -300, 300).name('Position Z');
    folder1.add(santaControls, 'rx', -90, 90).name('Rotation X');
    folder1.add(santaControls, 'ry', -180, 180).name('Rotation Y');
    folder1.add(santaControls, 'rz', -180, 180).name('Rotation Z');
    folder1.open();

    eyeControls = {
        wireframe: false,
        bulge: 66,
        height: 22,
        spread: 29,
        radius: 47,
        widthSegments: 32,
        heightSegments: 16,
        thetaLength: 1,
    };

    let folder2 = gui.addFolder('Eye controls');
    folder2.add(eyeControls, 'wireframe', 1, 32).name('Wireframes').onChange(moveEyes);
    folder2.add(eyeControls, 'bulge', 0, 180).name('Bulge').onChange(moveEyes);
    folder2.add(eyeControls, 'height', -90, 90).name('Height').onChange(moveEyes);
    folder2.add(eyeControls, 'spread', 0, 180).name('Spread').onChange(moveEyes);
    folder2.add(eyeControls, 'radius', 1, 100).name('Radius').onChange(recreateEyes);
    folder2.add(eyeControls, 'widthSegments', 1, 64).name('WidthSegments').onChange(recreateEyes);
    folder2.add(eyeControls, 'heightSegments', 1, 32).name('HeightSegments').onChange(recreateEyes);
    folder2.add(eyeControls, 'thetaLength', 0, Math.PI).name('ThetaLength').onChange(recreateEyes);
    folder2.open();
}


function moveEyes() {
    let height = eyeControls.height;
    let spread = eyeControls.spread;
    let bulge = eyeControls.bulge;

    if (leftEye) {
        leftEye.setWireframeVisibility(eyeControls.wireframe);
        leftEye.calculatePosition(bulge, height, spread);
        leftEye.calculateRotation(height, spread);
    }
    if (leftLens) {
        leftLens.setWireframeVisibility(eyeControls.wireframe);
        leftLens.calculatePosition(bulge+1, height, spread);
        leftLens.calculateRotation(height, spread)
    }

    if (rightEye) {
        rightEye.setWireframeVisibility(eyeControls.wireframe);
        rightEye.calculatePosition(bulge, height, spread);
        rightEye.calculateRotation(height, spread);
    }
    if (rightLens) {
        rightLens.setWireframeVisibility(eyeControls.wireframe);
        rightLens.calculatePosition(bulge+1, height, spread);
        rightLens.calculateRotation(height, spread)
    }
}


function recreateEyes() {
    leftEye.recreate(createEyeBallGeometry());
    leftLens.recreate(createEyeLensGeometry());
    rightEye.recreate(createEyeBallGeometry());
    rightLens.recreate(createEyeLensGeometry());
}


function moveSphere() {
    if (santa.hand) {
        santa.hand.position.x = santaControls.px;
        santa.hand.position.y = santaControls.py;
        santa.hand.position.z = santaControls.pz;
        santa.hand.rotation.x = degToRad(santaControls.rx);
        santa.hand.rotation.y = degToRad(santaControls.ry);
        santa.hand.rotation.z = degToRad(santaControls.rz);
    }
    if (santa.faceWireFrame) {
        santa.faceWireFrame.visible = santaControls.wireframe;
    }

    TWEEN.update();
    leftLens.recreate(createEyeLensGeometry());
    rightLens.recreate(createEyeLensGeometry());
}


//


function createTweens() {
    let position = {x: 0, y: 120, z: 0};
    let target = {x: -200, y: 120, z: -100};
    tween = new TWEEN.Tween(position).to(target, 2000);
    tween.onUpdate(function () {
        console.log(position);
        santa.hand.position.x = position.x;
        santa.hand.position.y = position.y;
        santa.hand.position.z = position.z;
    });
    tween.start();
}


function doStuff() {
    addLights();
    createSanta();
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}


// Animate:

function animate() {
    requestAnimationFrame(animate);

    ++tick;
    delta = clock.getDelta();
    moveObjects(delta);
    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function moveObjects(delta) {
    moveSphere();
}


// Start things:

$(document).ready(function () {
    init();
    animate();
});


// Init:

function init() {
    initClock();
    initGui();
    initScene();
    initRenderer();
    initCamera();
}


function initClock() {
    clock = new THREE.Clock()
}


function initScene() {
    scene = new THREE.Scene();
    drawHelpers();
    doStuff();
}


function initRenderer() {
    renderer = new THREE.WebGLRenderer({antialias: true, gammaInput: true, gammaOutput: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xF3F3F3, 1.0);
    document.body.appendChild(renderer.domElement);
}






