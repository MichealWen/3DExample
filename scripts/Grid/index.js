/**
 * Created by b.soldovsky on 18.04.2014.
 */
'use strict';

// STATS
var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

var scene, camera, renderer, controls, light;

// SCENE
scene = new THREE.Scene();

// CAMERA
camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 50, 0);
camera.lookAt(scene.position);

// RENDERER
renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
light = new THREE.PointLight(0x44fe3f);
light.position.set(100, 250, 100);
scene.add(light);

// SKYBOX
var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
var skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
scene.add(skyBox);

// CONTROLS
controls = new THREE.OrbitControls(camera, renderer.domElement);


//endregion

//region floor
var floorGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
var floors = [];

for (var i = 0; i < 9; i++) {
    floors.push(new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({ color: 0x119922, side: THREE.DoubleSide })));
}

floors[0].position.x = -10;
floors[0].position.z = -10;

floors[1].position.x = 0;
floors[1].position.z = -10;

floors[2].position.x = 10;
floors[2].position.z = -10;

floors[3].position.x = -10;
floors[3].position.z = 0;

floors[4].position.x = 0;
floors[4].position.z = 0;

floors[5].position.x = 10;
floors[5].position.z = 0;

floors[6].position.x = -10;
floors[6].position.z = 10;

floors[7].position.x = 0;
floors[7].position.z = 10;

floors[8].position.x = 10;
floors[8].position.z = 10;

for (var i = 0; i < floors.length; i++) {
    floors[i].rotation.x = Math.PI / 2;
}

for (var i = 0; i < floors.length; i++) {
    scene.add(floors[i]);
}

//endregion

var projector = new THREE.Projector();
var state;

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('keydown', onKeyDown, false);

function onKeyDown(event) {
    // KeyCode 32 (SPACE)
    if (event.keyCode == 32) {
        state = 1;
    }

    // KeyCode 83 (S)
    if (event.keyCode == 83) {
        state = 0;
    }
}

function onMouseMove(event) {
    // Получаем значение x от -1 до 1
    var x = ( event.clientX / window.innerWidth ) * 2 - 1;
    // Получаем значение y от -1 до 1
    var y = -( event.clientY / window.innerHeight ) * 2 + 1;

    // создаем некий вектор с этими значениями
    var vector = new THREE.Vector3(x, y, 0);

    // Преобразуем координаты мыши в координаты мира
    projector.unprojectVector(vector, camera);

    // Вычитаем из вектора позицию камеры и нормализуем
    var direction = vector.sub(camera.position).normalize();

    // Узнаем дистанцию между камерой и направлением ?
    var distance = -camera.position.y / direction.y;

    // Конечная позиция
    var diff = direction.multiplyScalar(distance);
    var cpos = camera.position.clone();
    var position = cpos.add(diff);

    if (state) {
        if (position.x >= -15 && position.x <= 15 && position.z >= -15 && position.z <= 15) {

            for (var i = 0; i < floors.length; i++) {
                var top = floors[i].position.z - 5;
                var left = floors[i].position.x - 5;
                var right = floors[i].position.x + 5;
                var bottom = floors[i].position.z + 5;
                if (position.x >= left && position.x <= right && position.z >= top && position.z <= bottom) {
                    floors[i].material.color.setRGB (0, 0, 1);
                } else {
                    floors[i].material.color.setRGB (0.5, 1, 0);
                }
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
