const advantages_list = document.getElementById("advantages_list");
const disadvantages_list = document.getElementById("disadvantages_list");

async function loadText() {
    const db_json = await fetch("/db/info.json")
        .then(res => res.json())
        .then(out => out)
        .catch(err => { throw err });

    console.log(db_json);

    advantages_list.innerHTML = "";
    disadvantages_list.innerHTML = "";

    db_json.advantages.forEach(element => {
        advantages_list.innerHTML += `
    <div class="entry">
        <div class="main">
            ${element.title}
        </div>
        <div class="text">
            ${element.description}
        </div>
    </div>
    `;
    });

    db_json.disadvantages.forEach(element => {
        disadvantages_list.innerHTML += `
    <div class="entry">
        <div class="main">
            ${element.title}
        </div>
        <div class="text">
            ${element.description}
        </div>
    </div>
    `;
    });
}

loadText();

const content = document.getElementsByClassName("content");
Array.from(content).forEach(element => makeDraggable(element));

function makeDraggable(element) {
    let pos = { left: 0, x: 0 };

    const mouseDownHandler = function (e) {
        pos = {
            // The current scroll
            left: element.scrollLeft,
            // Get the current mouse position
            x: e.clientX,
        };

        element.addEventListener("mousemove", mouseMoveHandler);
        element.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;

        // Scroll the element
        element.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function () {
        element.removeEventListener("mousemove", mouseMoveHandler);
        element.removeEventListener("mouseup", mouseUpHandler);
    };

    element.addEventListener("mousedown", mouseDownHandler);
}

let translateY = -20;
let rotateX = 90;
let scale = 0.7;
let checking = true;

document.addEventListener("wheel", function (e) {
    if (document.body.scrollTop > 700 || document.documentElement.scrollTop > 700) {
        console.log(e.wheelDeltaY);

        if (!checking) {
            return;
        }

        translateY += 2;

        rotateX -= 9;

        scale += 0.03;

        document.getElementById("bmw").style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`;

        if (translateY == 0) {
            checking = false;
        }
    }
});

let scene, camera, renderer;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
    camera.rotation.y = 45 / 180 * Math.PI;
    camera.position.x = 800;
    camera.position.y = 100;
    camera.position.z = 1000;

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', renderer);

    hlight = new THREE.AmbientLight(0x404040, 100);
    scene.add(hlight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 100);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    light = new THREE.PointLight(0xc4c4c4, 10);
    light.position.set(0, 300, 500);
    scene.add(light);
    light2 = new THREE.PointLight(0xc4c4c4, 10);
    light2.position.set(500, 100, 0);
    scene.add(light2);
    light3 = new THREE.PointLight(0xc4c4c4, 10);
    light3.position.set(0, 100, -500);
    scene.add(light3);
    light4 = new THREE.PointLight(0xc4c4c4, 10);
    light4.position.set(-500, 300, 500);
    scene.add(light4);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let loader = new THREE.GLBLoader();
    loader.load('bmw_emblem.glb', function (gltf) {
        car = gltf.scene.children[0];
        car.scale.set(0.5, 0.5, 0.5);
        scene.add(gltf.scene);
        animate();
    });
    init();
}