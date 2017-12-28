let arm, forearm, body;
let armControls;


function createArm( object3d, length ) {
    let dimension = new THREE.Vector3( 10, length, 10);
    let c = new Cube( dimension, new THREE.Color( 'darkgreen' ) );
    object3d.add( c.mesh );
}


function setupArmControls(gui) {
    armControls = {
        by: 0,
        uy: 70,
        uz: -15,
        fx: 0,
        fy: 10,
        fz: 60
    };
    let folder = gui.addFolder( 'Arm controls' );
    folder.add( armControls, 'by', -180, 180 ).name( 'Body y' );
    folder.add( armControls, 'uy', -180, 180 ).name( 'Upper arm y' );
    folder.add( armControls, 'uz', -45, 45 ).name( 'Upper arm z' );
    folder.add( armControls, 'fx', -180, 180 ).name( 'Forearm x' );
    folder.add( armControls, 'fy', -180, 180 ).name( 'Forearm y' );
    folder.add( armControls, 'fz', -120, 120 ).name( 'Forearm z' );
    folder.open();
}


function moveArm() {
    body.rotation.y = armControls.by * Math.PI/180;	// yaw

    arm.rotation.y = armControls.uy * Math.PI/180;	// yaw
    arm.rotation.z = armControls.uz * Math.PI/180;	// roll

    forearm.rotation.x = armControls.fx * Math.PI/180;	// yaw
    forearm.rotation.y = armControls.fy * Math.PI/180;	// yaw
    forearm.rotation.z = armControls.fz * Math.PI/180;	// roll
}


function armTest() {
    // let forearm = new THREE.Object3D();
    // let faLength = 80;
    // createArm( forearm, faLength );
    //
    // let arm = new THREE.Object3D();
    // let uaLength = 120;
    // createArm( arm, uaLength );
    //
    // forearm.position.y = uaLength;
    // arm.add( forearm );
    //
    // scene.add( arm );

    // Robot definitions
    let robotBaseMaterial = new THREE.MeshPhongMaterial( { color: 0x6E23BB, specular: 0x6E23BB, shininess: 20 } );
    let robotForearmMaterial = new THREE.MeshPhongMaterial( { color: 0xF4C154, specular: 0xF4C154, shininess: 100 } );
    let robotUpperArmMaterial = new THREE.MeshPhongMaterial( { color: 0x95E4FB, specular: 0x95E4FB, shininess: 100 } );
    let robotBodyMaterial = new THREE.MeshPhongMaterial( { color: 0x279933, specular: 0x279933, shininess: 100 } );

    let torus = new THREE.Mesh( new THREE.TorusGeometry( 22, 15, 32, 32 ), robotBaseMaterial );
    torus.rotation.x = 90 * Math.PI/180;
    scene.add( torus );

    forearm = new THREE.Object3D();
    let faLength = 80;

    createRobotExtender( forearm, faLength, robotForearmMaterial );

    arm = new THREE.Object3D();
    let uaLength = 120;

    createRobotCrane( arm, uaLength, robotUpperArmMaterial );

    forearm.position.y = uaLength;
    arm.add( forearm );

    body = new THREE.Object3D();
    body.add(arm);
    let bodyLength = 60;
    arm.position.y = bodyLength;
    createRobotBody( body, bodyLength, robotBodyMaterial );
    scene.add(body);
}



function createRobotExtender( part, length, material )
{
    let cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 22, 22, 6, 32 ), material );
    part.add( cylinder );

    for ( let i = 0; i < 4; i++ )
    {
        let box = new THREE.Mesh( new THREE.CubeGeometry( 4, length, 4 ), material );
        box.position.x = (i < 2) ? -8 : 8;
        box.position.y = length/2;
        box.position.z = (i%2) ? -8 : 8;
        part.add( box );
    }

    cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry( 15, 15, 40, 32 ), material );
    cylinder.rotation.x = 90 * Math.PI/180;
    cylinder.position.y = length;
    part.add( cylinder );
}

function createRobotCrane( part, length, material )
{
    let box = new THREE.Mesh(
        new THREE.CubeGeometry( 18, length, 18 ), material );
    box.position.y = length/2;
    part.add( box );

    let sphere = new THREE.Mesh(
        new THREE.SphereGeometry( 20, 32, 16 ), material );
    // place sphere at end of arm
    sphere.position.y = length;
    part.add( sphere );
}

function createRobotBody( part, length, material )
{
    let cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry( 50, 12, length/2, 18 ), material );
    cylinder.position.y = length/4;
    part.add( cylinder );

    cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry( 12, 50, length/2, 18 ), material );
    cylinder.position.y = 3*length/4;
    part.add( cylinder );

    let box = new THREE.Mesh(
        new THREE.CubeGeometry( 12, length/4, 110 ), material );
    box.position.y = length/2;
    part.add( box );

    let sphere = new THREE.Mesh(
        new THREE.SphereGeometry( 20, 32, 16 ), material );
    // place sphere at end of arm
    sphere.position.y = length;
    part.add( sphere );
}