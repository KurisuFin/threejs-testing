let gui, helperGui;
let groundSize = 1000;
let openHelperFolder = false;


function initGui() {
    let gui = new dat.GUI();
    helperGui = new HelperGui( gui );
    // setupArmControls( gui );
    setupControls( gui );
}




class HelperGui {
    constructor(gui) {
        this.values = {
            gridX: true,
            gridY: false,
            gridZ: false,
            ground: true,
            axes: false,
        };
        this.createGuiFolder( gui );
    }

    createGuiFolder(gui) {
        let folder = gui.addFolder( 'World' );
        for ( let key in this.values ) {
            let controller = folder.add( this.values, key );
            controller.onChange( initScene );
        }
        if ( openHelperFolder ) {
            folder.open();
        }
    }

    getValue(name) {
        return this.values[name];
    }
}


function drawHelpers() {
    if ( helperGui.getValue( 'gridX' ) ) {
        Coordinates.drawGrid( { size: groundSize, scale: 0.01 } );
    }
    if ( helperGui.getValue( 'gridY' ) ) {
        Coordinates.drawGrid( { size: groundSize, scale: 0.01, orientation: 'y' } );
    }
    if ( helperGui.getValue( 'gridZ' ) ) {
        Coordinates.drawGrid( { size: groundSize, scale: 0.01, orientation: 'z' } );
    }
    if ( helperGui.getValue( 'ground' ) ) {
        Coordinates.drawGround( { size: groundSize } );
    }
    if ( helperGui.getValue( 'axes' ) ) {
        Coordinates.drawAllAxes( { axisLength: 200, axisRadius: 1, axisTess: 50 } );
    }
}