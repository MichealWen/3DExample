/**
 * Created by SoldovskijBB on 10.04.14.
 */
'use strict';

var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

var scene, camera, renderer, controls, light;
var bullets = [], drons = [];
var directionalVector = new THREE.Vector3(0, 0, 0.3);

var cubeMaterialArray = [];
cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0xff3333 }));
cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0xff8800 }));
cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0xffff33 }));
cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0x33ff33 }));
cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0x000000 }));
cubeMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);

// SCENE
scene = new THREE.Scene();

// CAMERA
camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 25, 25);
camera.lookAt(scene.position);

// RENDERER
renderer = new THREE.WebGLRenderer();
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

// CUSTOM
var logObject = new THREE.SphereGeometry(0.5, 16, 8);
var logMesh = new THREE.Mesh(logObject, new THREE.MeshLambertMaterial({ color: 0x880000}));
logMesh.position.set(0, 0, 0);
scene.add(logMesh);

// CONTROLS
controls = new THREE.OrbitControls(camera, renderer.domElement);

// STATES
var STATE = { NONE: 0, LOOKAT: 1, START: 2, STOP: 3, ADDBULLET: 4, DRON: 5 };
var state = STATE.NONE;
var isMoved = false;

function onKeyDown(event) {
    // KeyCode 32 (SPACE)
    if (event.keyCode == 32) {
        state = STATE.ADDBULLET;
    }

    // KeyCode 83 (S)
    if (event.keyCode == 83) {
        state = STATE.START;
        isMoved = true;
    }

    // KeyCode 81 (Q)
    if (event.keyCode == 81) {
        state = STATE.STOP;
        isMoved = false;
    }

    // KeyCode 76 (L)
    if (event.keyCode == 76) {
        state = STATE.LOOKAT;
    }

    // KeyCode 65 (A)
    if (event.keyCode == 65) {
        state = STATE.DRON;
    }
}

window.addEventListener('keydown', onKeyDown, false);

animate();

function animate() {
    stats.begin();

    requestAnimationFrame(animate);
    update();
    render();

    stats.end();
}

function update() {
    controls.update();

    if (state == STATE.ADDBULLET) {
        var bullet;
        var axisHelper;

        axisHelper = new THREE.AxisHelper( 5 );

        bullet = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), cubeMaterials);
        bullet.position.set(camera.position.x, camera.position.y, camera.position.z);

        bullet.add(axisHelper);

        // Вычисляем угол, куда смотрит камера
        var cv;
        cv = new THREE.Vector3(0, 0, -1);
        cv.applyQuaternion(camera.quaternion);

        // Перемещаем пулю на 10 едениц впереди от камеры
        bullet.translateOnAxis(cv, 10);
        // Добавляем пулю на сцену
        scene.add(bullet);

        // Добавляем пулю в массив пуль
        bullets.push(bullet);

        if(isMoved){
            state = STATE.START;
        } else {
            state = STATE.NONE;
        }
    }

    if (state == STATE.LOOKAT) {
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].lookAt(logMesh.position);
        }

        if(isMoved){
            state = STATE.START;
        } else {
            state = STATE.NONE;
        }
    }

    if(state == STATE.DRON){
        for (var i = 0; i < bullets.length; i++) {
            var dron = new THREE.Mesh(new THREE.CubeGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial( { color: 0x000088 } ))
            dron.position.set(bullets[i].position.x, bullets[i].position.y, bullets[i].position.z);

            scene.add(dron);

            drons.push(dron);
        }

        if(isMoved){
            state = STATE.START;
        } else {
            state = STATE.NONE;
        }
    }

    if (state == STATE.START) {
//        for (var i = 0; i < bullets.length; i++) {
//            if (bullets[i].position.distanceTo(logMesh.position) > 5) {
//                bullets[i].translateOnAxis(directionalVector, 0.1);
//                bullets[i].position.y -= 0.05;
//            }
//        }

        if(drons.length) {
            for (var i = 0; i < drons.length; i++) {
                if (drons[i].position.distanceTo(logMesh.position) > 1) {
                    drons[i].lookAt(logMesh.position);
                    drons[i].translateOnAxis(directionalVector, 2);
                } else {
                    scene.remove(drons[i]);
                }
            }
        }
    }
}

function render() {
    renderer.render(scene, camera);
}