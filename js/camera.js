let camera, cameraControls;

let cam = {
    fov: 40,
    position: {
        x: 180,
        y: 360,
        z: 350
        // x: 500,
        // y: 0,
        // z: 0
    },
    target: {
        x: 0,
        y: 120,
        z: 0
    }
};


function initCamera() {
    camera = new THREE.PerspectiveCamera( cam.fov, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( cam.position.x, cam.position.y, cam.position.z );

    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( cam.target.x, cam.target.y, cam.target.z );
}
