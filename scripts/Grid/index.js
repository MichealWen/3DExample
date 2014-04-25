/**
 * Created by b.soldovsky on 18.04.2014.
 */
'use strict';

//region STATS, SCENE, CAMERA, RENDERER, LIGHT, SKYBOX, CONTROLS

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
camera.position.set(0, 0, 255);
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

//endregion

//region FLOOR
var floorGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);

// Размерность массива
var floorX = 10;
var floorY = 10;

// Создаем двумерный массив
var floors = new Array(floorX);
for (var i = 0; i < floorX; i++) {
    floors[i] = new Array(floorY);
}


// Заполняем двумерный массив
for (var i = 0; i < floorX; i++) {
    for (var j = 0; j < floorY; j++) {
        floors[i][j] = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({ color: 0x119922, side: THREE.DoubleSide }));
        floors[i][j].position.x = i * 10;
        floors[i][j].position.y = j * -10;
        floors[i][j].userData = {'x': i, 'y': j};
        scene.add(floors[i][j]);
    }
}

//endregion

var projector = new THREE.Projector();
var raycaster;
var cursor;

window.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event) {
    // Получаем значение x от -1 до 1
    var x = ( event.clientX / window.innerWidth ) * 2 - 1;
    // Получаем значение y от -1 до 1
    var y = -( event.clientY / window.innerHeight ) * 2 + 1;

    var mouse2D = new THREE.Vector3(x, y, 0.5);

    raycaster = projector.pickingRay(mouse2D.clone(), camera);

    for (var i = 0; i < floorX; i++) {
        var intercasts = raycaster.intersectObjects(floors[i]);
        if(intercasts.length > 0){
            if(cursor != intercasts[0].object) {
                cursor = intercasts[0].object;
                cursor.material.color = 0xaa0055;
            }
        }
    }
}

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
