let stopLines = true;


let lines = [];

let verticalLine = {
    amount: 13,
    length: 400,
    gap: 20
};

let horizontalLine = {
    amount: 13,
    length: (verticalLine.amount - 1) * verticalLine.gap,
    speed: 0.2
};


function moveLines() {
    if (stopLines) {
        return;
    }

    for (let i = 0; i < lines.length; ++i) {
        lines[i].move();
    }
}


function createLines() {
    createVerticalLines(verticalLine.amount);
    createHorizontalLines(horizontalLine.amount);
}


function createVerticalLines(amount) {
    let s = Math.floor(amount / 2);
    if (amount % 2 === 0) {
        s -= 0.5;
    }
    for (let i = 0; i < amount; ++i) {
        let x = (i - s) * verticalLine.gap;
        let vectors = [];
        vectors.push(new THREE.Vector3(x, 0, 0));
        vectors.push(new THREE.Vector3(x, 0, verticalLine.length));
        createLine(vectors)
    }
}


class MovingLine {
    constructor(vectors, color, z) {
        let material = new THREE.LineBasicMaterial({color: color});
        let geometry = new THREE.Geometry();
        for (let i = 0; i < vectors.length; ++i) {
            geometry.vertices.push(vectors[i]);
        }
        let line = new THREE.Line(geometry, material);
        scene.add(line);
        line.position.z = z;

        this.line = line;
        this.speed = horizontalLine.speed;
    }

    move() {
        this.line.position.z += this.speed;
        if (this.line.position.z > verticalLine.length) {
            this.line.position.z = 0;
        }
    }
}


function createHorizontalLines(amount) {
    let gap = verticalLine.length / horizontalLine.amount;
    for (let i = 0; i < amount; ++i) {
        let z = i * gap;
        let x1 = -horizontalLine.length / 2;
        let x2 = horizontalLine.length / 2;
        let vectors = [];
        vectors.push(new THREE.Vector3(x1, 0, 0));
        vectors.push(new THREE.Vector3(x2, 0, 0));
        let line = new MovingLine(vectors, color.pink, z);
        lines.push(line)
    }
}


function createLine(vectors) {
    let material = new THREE.LineBasicMaterial({color: color.pink});
    let geometry = new THREE.Geometry();
    for (let i = 0; i < vectors.length; ++i) {
        geometry.vertices.push(vectors[i]);
    }
    let line = new THREE.Line(geometry, material);
    scene.add(line);
    return line
}
