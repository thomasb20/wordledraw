// main.js for Wordledraw

const VALID_WORDS = [];
let answer = "";
const GRID_COLUMNS = 5;
const GRID_ROWS = 6;
const COLOURS = ["grey", "yellow", "green"];
const COLOUR_HEX = {
    grey: "#787c7e",
    yellow: "#c9b458",
    green: "#6aaa64"
};

let drawn_shape = Array.from(
    { length: GRID_ROWS },
    () => Array(GRID_COLUMNS).fill("grey")
);
window.drawn_shape = drawn_shape;

const canvas = document.getElementById("drawing-canvas");
const context = canvas.getContext("2d");

function draw_shape() {
    const cellWidth = canvas.width / GRID_COLUMNS;
    const cellHeight = canvas.height / GRID_ROWS;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < GRID_ROWS; row++) {
        for (let column = 0; column < GRID_COLUMNS; column++) {
            context.fillStyle = COLOUR_HEX[drawn_shape[row][column]];
            context.fillRect(
                column * cellWidth,
                row * cellHeight,
                cellWidth,
                cellHeight
            );

            context.strokeStyle = "#ffffff";
            context.lineWidth = 2;
            context.strokeRect(
                column * cellWidth,
                row * cellHeight,
                cellWidth,
                cellHeight
            );
        }
    }
}

canvas.addEventListener("click", (event) => {
    const bounds = canvas.getBoundingClientRect();
    const column = Math.floor((event.clientX - bounds.left) / (bounds.width / GRID_COLUMNS));
    const row = Math.floor((event.clientY - bounds.top) / (bounds.height / GRID_ROWS));

    if (row < 0 || row >= GRID_ROWS || column < 0 || column >= GRID_COLUMNS) {
        return;
    }

    const currentColourIndex = COLOURS.indexOf(drawn_shape[row][column]);
    drawn_shape[row][column] = COLOURS[(currentColourIndex + 1) % COLOURS.length];
    draw_shape();
});

document.getElementById("generate-button").addEventListener("click", () => {
    drawn_shape = drawn_shape.map(row => [...row]);
    window.drawn_shape = drawn_shape;
    console.log("Drawn shape:", drawn_shape);
    generate_words();
});

draw_shape();

// Load the selected valid-word list into the array
function load_word_list(useCommonWords) {
    const fileName = useCommonWords
        ? './valid-wordle-words-short.txt'
        : './valid-wordle-words.txt';
    const status = document.getElementById('word-list-status');

    VALID_WORDS.length = 0;
    answer = "";
    document.getElementById("wordle-answer").textContent = "";
    status.textContent = useCommonWords
        ? 'Loading common words...'
        : 'Loading all valid words...';

    fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not load ${fileName}`);
            }
            return response.text();
        })
        .then(text => {
            VALID_WORDS.push(...text.split(/\r?\n/).map(word => word.trim()).filter(Boolean));
            status.textContent = useCommonWords
                ? `Using common words (${VALID_WORDS.length})`
                : `Using all words valid in Wordle (${VALID_WORDS.length})`;
            console.log('Words loaded:', VALID_WORDS.length);
        })
        .catch(error => {
            status.textContent = 'Could not load the word list.';
            console.error('Error loading the words:', error);
        });
}

document.getElementById('common-words-toggle').addEventListener('change', (event) => {
    load_word_list(event.target.checked);
});

load_word_list(true);

document.getElementById('set-button').addEventListener('click', () => {
    // Check if input is valid
    let input = document.getElementById('wordle-answer-input').value.trim().toLowerCase();
    if (VALID_WORDS.includes(input)) {
        document.getElementById("wordle-answer").innerHTML = `${input}`;
        answer = input;
    }
    else {
        alert("The word must be a valid Wordle answer of 5 letters!")
    }
});


// Wordle algorithms

function get_colours(word){
    // Gets the colours of the word based on the answer.
    let colours = Array(5).fill("grey");
    let word_letters = word.split('');
    let answer_letters = answer.split('');
    let remaining_answer_letters = [];

    for (let i = 0; i < 5; i++) {
        if (word_letters[i] === answer_letters[i]) {
            colours[i] = "green";
        }
        else {
            remaining_answer_letters.push(answer_letters[i]);
        }
    }

    for (let i = 0; i < 5; i++) {
        if (colours[i] !== "green") {
            let answer_index = remaining_answer_letters.indexOf(word_letters[i]);
            if (answer_index !== -1) {
                colours[i] = "yellow";
                remaining_answer_letters.splice(answer_index, 1);
            }
        }
    }

    return colours;
}

function get_word(wanted_colours, excluded_words = []) {
    if (!Array.isArray(wanted_colours) || wanted_colours.length !== 5) {
        return null;
    }

    for (let i = 0; i < VALID_WORDS.length; i++) {
        let word = VALID_WORDS[i];
        if (excluded_words.includes(word)) {
            continue;
        }
        if (get_colours(word).every((colour, index) => colour === wanted_colours[index])) {
            return word;
        }
    }

    return null;
}

function generate_words() {
    const word_list = document.getElementById("word-list");
    word_list.replaceChildren();

    if (!answer) {
        const item = document.createElement("li");
        item.textContent = "Set a valid Wordle answer first.";
        word_list.appendChild(item);
        return;
    }

    if (VALID_WORDS.length === 0) {
        const item = document.createElement("li");
        item.textContent = "Valid words are still loading.";
        word_list.appendChild(item);
        return;
    }

    const used_words = [];

    for (let row = 0; row < GRID_ROWS; row++) {
        const wantedColours = drawn_shape[row];
        const word = get_word(wantedColours, used_words);
        const item = document.createElement("li");

        if (word !== null && get_colours(word).every((colour, index) => {
            return colour === wantedColours[index];
        })) {
            item.textContent = word;
            used_words.push(word);
        }
        else {
            item.textContent = "No matching word";
        }

        word_list.appendChild(item);
    }
}