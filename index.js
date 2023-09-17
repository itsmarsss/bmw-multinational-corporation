const advantages_list = document.getElementById("advantages_list");
const disadvantages_list = document.getElementById("disadvantages_list");

async function loadText() {
    const db_json = await fetch("db/info.json")
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

const degsToRads = deg => (deg * Math.PI) / 180.0;
const questions = document.getElementsByClassName("question");

Array.from(questions).forEach((element, index) => circulate(element, index));

function circulate(element, index) {
    let deg_interval = 360 / questions.length;
    let angle = deg_interval * index;
    let radius = 350;
    let x_trans = radius * Math.sin(degsToRads(angle));
    let y_trans = -1 * radius * Math.cos(degsToRads(angle));
    element.style.transform = `translateX(${x_trans}px) translateY(${y_trans}px)`;
}


