/**
 * Created by b.soldovsky on 18.04.2014.
 */
'use strict';

//region base
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
camera.position.set(0, 0, 50);
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

for (var i = 0; i < 18; i++) {
    floors.push(new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({ color: 0x119922, side: THREE.DoubleSide })));
}

floors[0].position.x = -10;
floors[0].position.y = -10;
floors[0].material.color.setRGB (0.2, 0.8, 0.2);

floors[1].position.x = 0;
floors[1].position.y = -10;
floors[1].material.color.setRGB (0.2, 0.8, 0.2);

floors[2].position.x = 10;
floors[2].position.y = -10;
floors[2].material.color.setRGB (0.2, 0.8, 0.2);

floors[3].position.x = -10;
floors[3].position.y = 0;
floors[3].material.color.setRGB (0.2, 0.8, 0.2);

floors[4].position.x = 0;
floors[4].position.y = 0;
floors[4].material.color.setRGB (0.2, 0.8, 0.2);

floors[5].position.x = 10;
floors[5].position.y = 0;
floors[5].material.color.setRGB (0.2, 0.8, 0.2);

floors[6].position.x = -10;
floors[6].position.y = 10;
floors[6].material.color.setRGB (0.2, 0.8, 0.2);

floors[7].position.x = 0;
floors[7].position.y = 10;
floors[7].material.color.setRGB (0.2, 0.8, 0.2);

floors[8].position.x = 10;
floors[8].position.y = 10;
floors[8].material.color.setRGB (0.2, 0.8, 0.2);


floors[9].position.x = -10;
floors[9].position.y = -10;
floors[9].position.z = 10;

floors[10].position.x = 0;
floors[10].position.y = -10;
floors[10].position.z = 10;

floors[11].position.x = 10;
floors[11].position.y = -10;
floors[11].position.z = 10;

floors[12].position.x = -10;
floors[12].position.y = 0;
floors[12].position.z = 10;

floors[13].position.x = 0;
floors[13].position.y = 0;
floors[13].position.z = 10;

floors[14].position.x = 10;
floors[14].position.y = 0;
floors[14].position.z = 10;

floors[15].position.x = -10;
floors[15].position.y = 10;
floors[15].position.z = 10;

floors[16].position.x = 0;
floors[16].position.y = 10;
floors[16].position.z = 10;

floors[17].position.x = 10;
floors[17].position.y = 10;
floors[17].position.z = 10;

for (var i = 0; i < floors.length; i++) {
    scene.add(floors[i]);
}

//endregion

var projector = new THREE.Projector();
var state;

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('keydown', onKeyDown, false);

function addLog(string){
    var log = document.getElementById('log');
    log.innerText += string + '\n';
}

function clearLog(){
    var log = document.getElementById('log');
    log.innerText = '';
}

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

    // Создаем некий вектор с этими значениями
    var vector = new THREE.Vector3(x, y, 0);

    // Меняем положение вектора на положение камеры
    projector.unprojectVector(vector, camera);

    // Вычитаем из вектора позицию камеры и нормализуем
    var direction = vector.sub(camera.position).normalize();

    // Узнаем дистанцию между камерой и направлением ?
    var distance = -camera.position.z / direction.z;

    // Умножаем направление на дистанцию
    var diff = direction.multiplyScalar(distance);

    // Берем позицию камеры
    var cpos = camera.position.clone();

    // К поцизии камеры добавляем разницу
    var position = cpos.add(diff);



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
