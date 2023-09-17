function loadEmblemModel() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("bmw_cont").innerHTML = "";
    document.getElementById("bmw_cont").appendChild(renderer.domElement);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
    directionalLight.position.set(0, 0.5, 1);
    scene.add(directionalLight);

    var loader = new THREE.GLTFLoader();

    var model; // This will hold your loaded model
    var targetRotationX = 0; // Target rotation on the X-axis
    var targetRotationY = 0; // Target rotation on the Y-axis
    var lerpFactor = 0.1; // Adjust this value to control the smoothness of the transition

    // Load the GLTF model
    loader.load("db/bmw_emblem.gltf", function (gltf) {
        model = gltf.scene;
        scene.add(model);
    }, undefined, function (error) {
        console.error(error);
    });

    // Set up camera position
    camera.position.z = 5;

    // Initialize the current rotation
    var currentRotationX = 0;
    var currentRotationY = 0;

    // Set up mouse move event listener
    var mouse = new THREE.Vector2();
    document.addEventListener("mousemove", onMouseMove, false);

    function onMouseMove(event) {
        // Normalize mouse coordinates to the range [-1, 1]
        mouse.x = ((event.clientX / window.innerWidth) * 2 - 1) / 2;
        mouse.y = ((event.clientY / window.innerHeight) * 1.5) / 2;

        // Calculate the target rotation based on mouse position
        targetRotationX = mouse.y * Math.PI;
        targetRotationY = mouse.x * Math.PI;
    }

    // Add event listener to detect clicks
    document.getElementById("bmw_cont").addEventListener("click", onClick, false);

    function onClick() {
        updateAnswer("(Hover/Click a Question)");

        if (model) {
            // Animate the scaling
            animateScale(1, 1.1, 100, function () {
                // Scale up to 1.2
                animateScale(1.1, 1, 100, null); // Then scale back to 1
            });
        }
    }

    // Function to animate scaling
    function animateScale(startScale, endScale, duration, onComplete) {
        var startTime = Date.now();

        function animate() {
            var currentTime = Date.now();
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var newScale = startScale + (endScale - startScale) * progress;

            // Apply scaling to the model
            model.scale.set(newScale, newScale, newScale);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (onComplete) {
                    onComplete();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Create an animation loop to render the scene
    var animate = function () {
        requestAnimationFrame(animate);

        // Smoothly interpolate the current rotation towards the target rotation
        currentRotationX += (targetRotationX - currentRotationX) * lerpFactor;
        currentRotationY += (targetRotationY - currentRotationY) * lerpFactor;

        if (model) {
            // Apply the interpolated rotation to the model
            model.rotation.x = currentRotationX;
            model.rotation.y = currentRotationY;
        }

        renderer.render(scene, camera);
    };

    animate();
}

loadEmblemModel();
