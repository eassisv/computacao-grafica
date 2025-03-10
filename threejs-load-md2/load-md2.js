/**
 * Demonstrates how to load MD2 models.
 * 
 * Credits: https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_md2.html
 *
 */


import * as THREE from '../../libs/three.js-r110/build/three.module.js';
import Stats from '../../libs/three.js-r110/examples/jsm/libs/stats.module.js';
import { GUI } from '../../libs/three.js-r110/examples/jsm/libs/dat.gui.module.js';

import { OrbitControls } from '../../libs/three.js-r110/examples/jsm/controls/OrbitControls.js';
import { MD2Character } from '../../libs/three.js-r110/examples/jsm/misc/MD2Character.js';

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, camera, scene, renderer;

var character;

var gui, playbackConfig = {
    speed: 1.0,
    wireframe: false
};

var controls;

var clock = new THREE.Clock();

var stats;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 150, 400);

    // SCENE

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.Fog(0x050505, 400, 1000);

    // LIGHTS

    scene.add(new THREE.AmbientLight(0x222222));

    var light = new THREE.SpotLight(0xffffff, 5, 1000);
    light.position.set(200, 250, 500);
    light.angle = 0.5;
    light.penumbra = 0.5;

    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    //scene.add( new CameraHelper( light.shadow.camera ) );
    scene.add(light);

    var light = new THREE.SpotLight(0xffffff, 5, 1000);
    light.position.set(- 100, 350, 350);
    light.angle = 0.5;
    light.penumbra = 0.5;

    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    // scene.add( new CameraHelper( light.shadow.camera ) );
    scene.add(light);

    //  GROUND

    var gt = new THREE.TextureLoader().load("../../libs/three.js-r110/examples/textures/terrain/grasslight-big.jpg");
    var gg = new THREE.PlaneBufferGeometry(2000, 2000);
    var gm = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });

    var ground = new THREE.Mesh(gg, gm);
    ground.rotation.x = - Math.PI / 2;
    ground.material.map.repeat.set(8, 8);
    ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
    ground.receiveShadow = true;

    scene.add(ground);

    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container.appendChild(renderer.domElement);

    //

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    // STATS

    stats = new Stats();
    container.appendChild(stats.dom);

    // EVENTS

    window.addEventListener('resize', onWindowResize, false);

    // CONTROLS

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 50, 0);
    controls.update();

    // GUI

    gui = new GUI();

    gui.add(playbackConfig, 'speed', 0, 2).onChange(function () {

        character.setPlaybackRate(playbackConfig.speed);

    });

    gui.add(playbackConfig, 'wireframe', false).onChange(function () {

        character.setWireframe(playbackConfig.wireframe);

    });

    // CHARACTER

    var config = {

        baseUrl: "../../libs/three.js-r110/examples/models/md2/ratamahatta/",

        body: "ratamahatta.md2",
        skins: [
            "ratamahatta.png", "ctf_b.png", "ctf_r.png", "dead.png", "gearwhore.png"
        ],
        weapons: [
            ["weapon.md2", "weapon.png"],
            ["w_bfg.md2", "w_bfg.png"],
            ["w_blaster.md2", "w_blaster.png"],
            ["w_chaingun.md2", "w_chaingun.png"],
            ["w_glauncher.md2", "w_glauncher.png"],
            ["w_hyperblaster.md2", "w_hyperblaster.png"],
            ["w_machinegun.md2", "w_machinegun.png"],
            ["w_railgun.md2", "w_railgun.png"],
            ["w_rlauncher.md2", "w_rlauncher.png"],
            ["w_shotgun.md2", "w_shotgun.png"],
            ["w_sshotgun.md2", "w_sshotgun.png"]
        ]
    };

    character = new MD2Character();
    character.scale = 2;

    character.onLoadComplete = function () {

        setupSkinsGUI(character);
        setupWeaponsGUI(character);
        setupGUIAnimations(character);

        character.setAnimation(character.meshBody.geometry.animations[0].name);

    };

    character.loadParts(config);

    scene.add(character.root);

}

// EVENT HANDLERS

function onWindowResize() {

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

}

// GUI

function labelize(text) {

    var parts = text.split(".");

    if (parts.length > 1) {

        parts.length -= 1;
        return parts.join(".");

    }

    return text;

}

//

function setupWeaponsGUI(character) {

    var folder = gui.addFolder("Weapons");

    var generateCallback = function (index) {

        return function () {

            character.setWeapon(index);

        };

    };

    var guiItems = [];

    for (var i = 0; i < character.weapons.length; i++) {

        var name = character.weapons[i].name;

        playbackConfig[name] = generateCallback(i);
        guiItems[i] = folder.add(playbackConfig, name).name(labelize(name));

    }

}

//

function setupSkinsGUI(character) {

    var folder = gui.addFolder("Skins");

    var generateCallback = function (index) {

        return function () {

            character.setSkin(index);

        };

    };

    var guiItems = [];

    for (var i = 0; i < character.skinsBody.length; i++) {

        var name = character.skinsBody[i].name;

        playbackConfig[name] = generateCallback(i);
        guiItems[i] = folder.add(playbackConfig, name).name(labelize(name));

    }

}

//

function setupGUIAnimations(character) {
    var folder = gui.addFolder("Animations");

    var generateCallback = function (animationClip) {

        return function () {

            character.setAnimation(animationClip.name);

        };

    };

    var i = 0, guiItems = [];
    var animations = character.meshBody.geometry.animations;

    for (var i = 0; i < animations.length; i++) {

        var clip = animations[i];

        playbackConfig[clip.name] = generateCallback(clip);
        guiItems[i] = folder.add(playbackConfig, clip.name, clip.name);

        i++;

    }
}

function animate() {
    requestAnimationFrame(animate);
    render();

    stats.update();
}

function render() {
    var delta = clock.getDelta();
    character.update(delta);

    // character.root.rotation.y += 0.02;
    renderer.render(scene, camera);
}

let i = 0;

document.addEventListener("keydown", ({key}) => {
    if (key === "d") {
        character.root.position.x += 2;
    }
    if (key === "a") {
        character.setAnimation(character.meshBody.geometry.animations[1].name);
        character.root.rotation.y = -1.5;
        character.root.position.x -= 2;
    }
    if (key === " ") {
        character.setAnimation(character.meshBody.geometry.animations[4].name);
        setTimeout(() => { 
            character.setAnimation(character.meshBody.geometry.animations[0].name);
        }, 500);
    }
})