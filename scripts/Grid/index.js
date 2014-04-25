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
camera.position.set(0, 0, 55);
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
var floorGeometry = new THREE.PlaneGeometry(5, 5, 1, 1);

// Размерность массива
var floorX = 100;
var floorY = 100;

// Сетка для библиотеки поиска пути
var PFgrid = new PF.Grid(floorX, floorY);
// Алгоритм поиска пути
var PFFinder = new PF.AStarFinder({allowDiagonal: true});

// Создаем двумерный массив
var floors = new Array(floorX);
for (var i = 0; i < floorX; i++) {
    floors[i] = new Array(floorY);
}

// Заполняем двумерный массив
for (var i = 0; i < floorX; i++) {
    for (var j = 0; j < floorY; j++) {
        floors[i][j] = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({ color: 0x119922, side: THREE.DoubleSide }));
        floors[i][j].position.x = i * 5;
        floors[i][j].position.y = j * -5;
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

    // Ищем столкновения рейкаста для каждого массива квадратов
    for (var i = 0; i < floorX; i++) {
        // Берем столкновения
        var intercasts = raycaster.intersectObjects(floors[i]);

        // Если они есть
        if (intercasts.length > 0) {
            // И это столкновение не тот же самый объект что предыдущий
            if (cursor != intercasts[0].object) {
                // Ставим новый найденный текущим
                cursor = intercasts[0].object;

                // Ищем как пройти от 0,0 до того, где курсор
                var PFPath = PFFinder.findPath(0, 0, cursor.userData.x, cursor.userData.y, PFgrid.clone());

                for (var k = 0; k < floorX; k++) {
                    for (var j = 0; j < floorY; j++) {
                        floors[k][j].material.color.setHex(0x119922);
                    }
                }

                for(var i = 0; i < PFPath.length; i++){
                    var cell = PFPath[i];
                    floors[cell[0]][cell[1]].material.color.setHex(0xff0022);
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
