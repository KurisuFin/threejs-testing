let line;
let MAX_POINTS = 500;
let geometry;
let ttt = 0;


function moveFiddle() {
    if ( geometry == null ) { return }
    ttt += 1;
    geometry.setDrawRange(ttt, 30);
}


function doFiddle() {
    geometry = new THREE.BufferGeometry();

    let positions = new Float32Array(MAX_POINTS * 3);
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    // geometry.setDrawRange(0, 10);

    let material = new THREE.LineBasicMaterial({color: color.blue});

    line = new THREE.Line(geometry, material);
    scene.add(line);

    let positions2 = line.geometry.attributes.position.array;
    let x = 0;
    let y = 0;
    let z = 0;
    let index = 0;
    for (let i = 0; i < MAX_POINTS; ++i) {
        positions2[index++] = x;
        positions2[index++] = y;
        positions2[index++] = z;
        x += (Math.random() - 0.5) * 30;
        y += (Math.random() - 0.5) * 30;
        z += (Math.random() - 0.5) * 30;
    }
}
