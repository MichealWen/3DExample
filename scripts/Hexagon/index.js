/**
 * Created by SoldovskijBB on 20.04.14.
 */
'use strict';

// VARIABLES
var projector = new THREE.Projector();
var state;

// STATS
var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

// SCENE
var scene = new THREE.Scene();

// CAMERA
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 0, 110);
camera.lookAt(scene.position);

// RENDERER
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
var light = new THREE.PointLight(0x44fe3f);
light.position.set(100, 250, 100);
scene.add(light);

// SKYBOX
var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
var skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
scene.add(skyBox);

// CONTROLS
var controls = new THREE.OrbitControls(camera, renderer.domElement);

// EVENT LISTENERS
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('keydown', onKeyDown, false);

// EVENT CALLBACK
function onMouseMove() {

}

function onKeyDown() {

}

// CUSTOM
var axisHelper = new THREE.AxisHelper(5);
scene.add(axisHelper);
var hexSize = 10;
var hexHeight = hexSize * 2;
var hexVertDist = 3/4 * hexHeight;
var hexWidth = Math.sqrt(3)/2 * hexHeight;
var hexHorizDist = hexWidth;

var hexPosition = {
    x: 0,
    y: 0
};

hexPosition.x = 0;
hexPosition.y = 0;
CreateHexagon(hexSize, hexPosition);
hexPosition.x += hexHorizDist;
CreateHexagon(hexSize, hexPosition);
hexPosition.x += hexHorizDist;
CreateHexagon(hexSize, hexPosition);

hexPosition.x = 0;
hexPosition.y = 0;
hexPosition.x -=hexHorizDist / 2;
hexPosition.y -=hexVertDist;
CreateHexagon(hexSize, hexPosition);
hexPosition.x +=hexHorizDist;
CreateHexagon(hexSize, hexPosition);
hexPosition.x +=hexHorizDist;
CreateHexagon(hexSize, hexPosition);
hexPosition.x +=hexHorizDist;
CreateHexagon(hexSize, hexPosition);


hexPosition.x = 0;
hexPosition.y = 0;
hexPosition.x -=hexHorizDist;
hexPosition.y -=hexVertDist * 2;
CreateHexagon(hexSize, hexPosition);
hexPosition.x += hexHorizDist;
CreateHexagon(hexSize, hexPosition);
hexPosition.x += hexHorizDist;
CreateHexagon(hexSize, hexPosition);
hexPosition.x += hexHorizDist;
CreateHexagon(hexSize, hexPosition);
hexPosition.x += hexHorizDist;
CreateHexagon(hexSize, hexPosition);

hexPosition.x = 0;
hexPosition.y = 0;
hexPosition.x -=hexHorizDist / 2;
hexPosition.y -=hexVertDist * 3;
CreateHexagon(hexSize, hexPosition);
hexPosition.x +=hexHorizDist;
CreateHexagon(hexSize, hexPosition);
hexPosition.x +=hexHorizDist;
CreateHexagon(hexSize, hexPosition);
hexPosition.x +=hexHorizDist;
CreateHexagon(hexSize, hexPosition);

hexPosition.x = 0;
hexPosition.y = 0;
hexPosition.y -=hexVertDist * 4;
CreateHexagon(hexSize, hexPosition);
hexPosition.x += hexHorizDist;
CreateHexagon(hexSize, hexPosition);
hexPosition.x += hexHorizDist;
CreateHexagon(hexSize, hexPosition);

//GAME LOOP
animate();

function animate() {
    stats.begin();

    update();
    render();

    stats.end();

    requestAnimationFrame(animate);
}

function update() {
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}

function CreateHexagon(size, center) {
    var hexagonShape = new THREE.Shape();

    var x;
    var y;

    for (var i = 0; i <= 6; i++) {
        var angle = 2 * Math.PI / 6 * (i + 0.5);
        x = center.x + size * Math.cos(angle);
        y = center.y + size * Math.sin(angle);
        if (i == 0) {
            hexagonShape.moveTo(x, y);
        } else {
            hexagonShape.lineTo(x, y)
        }
    }

    var hexagonGeometry = new THREE.ShapeGeometry(hexagonShape);
    var hexagonMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var hexagonMesh = new THREE.Mesh(hexagonGeometry, hexagonMaterial);
    scene.add(hexagonMesh);
}