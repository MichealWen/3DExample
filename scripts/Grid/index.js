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
camera.position.set(0, 0, 60);
camera.up = new THREE.Vector3(0, 0, 1);

var cameraCenter = new THREE.Vector3(0, 0, 60);
var cameraRotate = new THREE.Vector3(50, -50, 0);

var cameraTarget = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }))
cameraTarget.position.copy(cameraRotate);

scene.add(cameraTarget);

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

//endregion

//region FLOOR
var floorGeometry = new THREE.PlaneGeometry(5, 5, 1, 1);

// Размерность массива
var floorX = 30;
var floorY = 30;

// Сетка для библиотеки поиска пути
var PFgrid = new PF.Grid(floorX, floorY);
// Алгоритм поиска пути
var PFFinder = new PF.AStarFinder({allowDiagonal: true});
//var PFFinder = new PF.AStarFinder({allowDiagonal: false});

// Создаем двумерный массив
var floors = new Array(floorX);
for (var i = 0; i < floorX; i++) {
    floors[i] = new Array(floorY);
}

// Заполняем двумерный массив
for (var i = 0; i < floorX; i++) {
    for (var j = 0; j < floorY; j++) {
        floors[i][j] = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({ color: 0x119922, side: THREE.FrontSide }));
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

var PlayerGridPosition = new THREE.Vector2(15, 15);
var PlayerObject = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), new THREE.MeshLambertMaterial({ color: 0xffffff }))
PlayerObject.position.setX(floors[PlayerGridPosition.x][PlayerGridPosition.y].position.x);
PlayerObject.position.setY(floors[PlayerGridPosition.x][PlayerGridPosition.y].position.y);
PlayerObject.position.setZ(2.5);
var PFPath;
var RoadPoints = [];
var StepIndex = 0;
var STATE = {NONE: 0, MOVE: 1}
var state = STATE.NONE;

scene.add(PlayerObject);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('mousedown', onMouseDown, false);

function onMouseDown(event) {
    if (event.button === 0 && PFPath && PFPath.length > 1) {
        RoadPoints.splice(0, RoadPoints.length);

        var geometry = new THREE.Geometry();


        for (var i = 1; i < PFPath.length; i++) {
            RoadPoints.push( {
                'world' : new THREE.Vector3(floors[PFPath[i][0]][PFPath[i][1]].position.x, floors[PFPath[i][0]][PFPath[i][1]].position.y, 2.5),
                'grid' : {'x' : PFPath[i][0], 'y' : PFPath[i][1]}
            });
        }

        for(var i = 0; i < RoadPoints.length; i++) {
            geometry.vertices.push(RoadPoints[i].world);
        }

        var material = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.5 });
        var line = new THREE.Line(geometry, material);
        scene.add(line);

        state = STATE.MOVE;
    }
}

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
                PFPath = PFFinder.findPath(PlayerGridPosition.x, PlayerGridPosition.y, cursor.userData.x, cursor.userData.y, PFgrid.clone());

                for (var x = 0; x < floorX; x++) {
                    for (var y = 0; y < floorY; y++) {
                        floors[x][y].material.color.setHex(0x119922);
                    }
                }

                var stepLenght = 5;
                if (PFPath.length < stepLenght) {
                    for (var d = 0; d < PFPath.length; d++) {
                        var cell = PFPath[d];
                        floors[cell[0]][cell[1]].material.color.setHex(0xff0022);
                    }
                } else {
                    for (var d = 0; d < stepLenght; d++) {
                        var cell = PFPath[d];
                        floors[cell[0]][cell[1]].material.color.setHex(0xff0022);
                    }

                    for (var d = stepLenght; d < PFPath.length; d++) {
                        var cell = PFPath[d];
                        floors[cell[0]][cell[1]].material.color.setHex(0xffFF22);
                    }
                }
            }
        }
    }
}

function onKeyDown(event) {
    // KeyCode 87 (W)
    if (event.keyCode == 87) {
        cameraCenter.y -= 2;
        cameraRotate.y -= 2;
    }

    // KeyCode 83 (S)
    if (event.keyCode == 83) {
        cameraCenter.y += 2;
        cameraRotate.y += 2;
    }

    // KeyCode 65 (A)
    if (event.keyCode == 65) {
        cameraCenter.x += 2;
        cameraRotate.x += 2;
    }

    // KeyCode 68 (D)
    if (event.keyCode == 68) {
        cameraCenter.x -= 2;
        cameraRotate.x -= 2;
    }

    // KeyCode 81 (Q)
    if (event.keyCode == 81) {
        cameraCenter.z -= 2;
    }

    // KeyCode 69 (E)
    if (event.keyCode == 69) {
        cameraCenter.z += 2;
    }

    // KeyCode 82 (R)
    if (event.keyCode == 82) {
        cameraRotate.x += 2;
        cameraRotate.y -= 2;
    }

    // KeyCode 70 (F)
    if (event.keyCode == 70) {
        cameraRotate.x -= 2;
        cameraRotate.y += 2;
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

    camera.position.setX(cameraCenter.x);
    camera.position.setY(cameraCenter.y);
    camera.position.setZ(cameraCenter.z);

    camera.lookAt(cameraRotate);
    cameraTarget.position.copy(cameraRotate);

    if (state == STATE.MOVE) {
        if (RoadPoints.length > 0) {
            if (PlayerObject.position.distanceTo(RoadPoints[StepIndex].world) > 0.2) {
                PlayerObject.lookAt(RoadPoints[StepIndex].world);
                PlayerObject.translateOnAxis(new THREE.Vector3(0, 0, 1), 0.2);
                console.log('q')
            } else {
                if (RoadPoints.length > StepIndex) {
                    console.log('e')
                    PlayerGridPosition.x = RoadPoints[StepIndex].grid.x;
                    PlayerGridPosition.y = RoadPoints[StepIndex].grid.y;
                    StepIndex++;
                    if (StepIndex == RoadPoints.length) {
                        state = STATE.NONE;
                        StepIndex = 0;
                    }
                }
            }
        }
    }
}

function render() {
    renderer.render(scene, camera);
}
