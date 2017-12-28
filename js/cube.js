let cubes = [];


function createCubes() {
    let dimension = new THREE.Vector3( 40, 100, 110 );
    let c = new Cube(dimension);
    c.setPosition( new THREE.Vector3( -50, 40, 200 ) );
    c.turnFrameOn();

    let c2 = new Cube(dimension);

    c.addToScene();
    cubes.push(c);
    console.log(c.mesh);
}


class Cube {
    constructor(dimension, color) {
        if (color === undefined) {
            color = new THREE.Color( 'darkgreen' );
        }
        let geometry = new THREE.BoxGeometry(dimension.x, dimension.y, dimension.z);
        let material = new THREE.MeshBasicMaterial( {color: color} );
        this.mesh = new THREE.Mesh(geometry, material);
    }

    addToScene() {
        scene.add(this.mesh);
    }

    turnFrameOn() {
        let geo = new THREE.EdgesGeometry( this.mesh.geometry );
        let mat = new THREE.LineBasicMaterial( { color: color.black, linewidth: 2 } );
        let wireframe = new THREE.LineSegments( geo, mat );
        this.mesh.add( wireframe );
    }

    setPosition(position) {
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;
    }

    setRotation(vector) {
        this.mesh.rotation.x = vector.x;
        this.mesh.rotation.y = vector.y;
        this.mesh.rotation.z = vector.z;
    }

    move(vector) {
        this.mesh.position.x += vector.x;
        this.mesh.position.y += vector.y;
        this.mesh.position.z += vector.z;
    }

    rotate(vector) {
        this.mesh.rotation.x += vector.x;
        this.mesh.rotation.y += vector.y;
        this.mesh.rotation.z += vector.z;
    }

    scale(vector) {
        // this.mesh.scale.set( vector );
        this.mesh.scale.x = vector.x;
        this.mesh.scale.y = vector.y;
        this.mesh.scale.z = vector.z;
    }
}


function moveCubes() {
    // let c = cubes[0];
    // if (!c) { return }
    //
    // let sinSpeed = 1;
    // // let sinCalm = 30;
    // let sinCalm = 50 / sinSpeed;
    // let sinSize = 50;
    // let x = Math.sin( tick / sinCalm ) / (sinCalm / sinSize);
    // // let x = Math.sin( tick /50);
    // // console.log(x);
    //
    // let scale = Math.sin( tick / 30 ) + 1.7;
    // let lisaX = 1/2 + 1/2 * Math.sin( tick / 60 );
    //
    // c.move( new THREE.Vector3( x, 0, 0 ) );
    // c.rotate( new THREE.Vector3( 0.005, 0.001, 0.00002 ) );
    // // c.scale( new THREE.Vector3( scale, scale / 5 + lisaX, scale / 3  + lisaX / 2) );
}
