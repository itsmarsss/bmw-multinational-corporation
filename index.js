const advantages_list = document.getElementById("advantages_list");
const disadvantages_list = document.getElementById("disadvantages_list");
const bmw_cont = document.getElementById("bmw_cont");
const bmw_info = document.getElementById("bmw_info");
const answer_mini = document.getElementById("answer_mini");
let answer;

let win_width = window.innerWidth;
let win_height = window.innerHeight;

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


async function loadQuestions() {
    const db_json = await fetch("db/qna.json")
        .then(res => res.json())
        .then(out => out)
        .catch(err => { throw err });

    console.log(db_json);

    bmw_info.innerHTML = "";

    db_json.qna.forEach(element => {
        if (element.question == "<ANSWER SLOT>" && element.answer == "<ANSWER SLOT>") {
            bmw_info.innerHTML += `
            <div class="real question answer">
                <div class="question_text answer_text">
                    <div class="accent" id="answer">(Hover/Click a Question)</div>
                </div>
            </div>`;
        } else {
            bmw_info.innerHTML += `
            <div class="real question" data-answer="${element.answer}">
                <div class="question_text">${element.question}</div>
            </div>`;
        }
    });

    answer = document.getElementById("answer");

    Array.from(questions).forEach((element, index) => { circulate(element, index); addHover(element) });

    resolutionCheck();
    win_width = 0;
    win_height = 0;
}

loadQuestions();

const content = document.getElementsByClassName("content");
Array.from(content).forEach(element => makeHorizontalScroll(element));

function makeHorizontalScroll(element) {
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
        if (window.innerWidth <= 950) {
            return;
        }

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
const questions = document.getElementsByClassName("real");

let answer_index;

function addHover(element) {
    if (element.classList.contains("answer") || element.classList.contains("answer_mini")) {
        element.addEventListener("click", (e) => e.stopPropagation());
        return;
    }

    element.addEventListener("mouseover", () => updateAnswer(element.getAttribute("data-answer")));
    element.addEventListener("click", scrollToAnswer);
}

function updateAnswer(answer_text) {
    answer.innerHTML = answer_text;
    answer_mini.innerHTML = answer_text;

    if (window.innerWidth <= 950) {
        Array.from(questions).forEach((element, index) => resetCirculate(element, index));
        return;
    }

    let deg_interval = 360 / questions.length;
    let angle = deg_interval * answer_index;
    let x_radius = Math.min(bmw_cont.offsetWidth, window.innerWidth) / 2 - 100;
    let y_radius = Math.min(bmw_cont.offsetHeight, window.innerHeight) / 2 - 100;
    let x_trans = x_radius * Math.sin(degsToRads(angle)) - answer.parentElement.parentElement.offsetWidth / 2;
    let y_trans = -1 * y_radius * Math.cos(degsToRads(angle)) - answer.parentElement.parentElement.offsetHeight / 2;
    answer.parentElement.parentElement.style.transform = `translateX(${x_trans}px) translateY(${y_trans}px)`;
}

function scrollToAnswer() {
    if (window.innerWidth <= 950) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

        return;
    }
}

function circulate(element, index) {
    if (element.classList.contains("answer")) {
        answer_index = index;
    }

    let deg_interval = 360 / questions.length;
    let angle = deg_interval * index;
    let x_radius = Math.min(bmw_cont.offsetWidth, window.innerWidth) / 2 - (index == 0 ? 150 : 200);
    let y_radius = Math.min(bmw_cont.offsetHeight, window.innerHeight) / 2 - (index == 0 ? 150 : 200) + (element.classList.contains("answer") ? 100 : 0);
    let x_trans = x_radius * Math.sin(degsToRads(angle)) - element.offsetWidth / 2;
    let y_trans = -1 * y_radius * Math.cos(degsToRads(angle)) - element.offsetHeight / 2;
    element.style.transform = `translateX(${x_trans}px) translateY(${y_trans}px)`;
}

function resetCirculate(element) {
    element.style.transform = "unset";
}

setInterval(() => {
    resolutionCheck();
}, 100);

function resolutionCheck() {
    if (win_width != window.innerWidth || win_height != window.innerHeight) {
        loadEmblemModel();

        win_width = window.innerWidth;
        win_height = window.innerHeight;

        if (window.innerWidth <= 950) {
            advantages_list.classList.add("snap");
            disadvantages_list.classList.add("snap");

            Array.from(questions).forEach((element, index) => resetCirculate(element, index));
            return;
        }

        advantages_list.classList.remove("snap");
        disadvantages_list.classList.remove("snap");

        Array.from(questions).forEach((element, index) => circulate(element, index));
    }
}
