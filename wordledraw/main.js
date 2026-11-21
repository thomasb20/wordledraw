// main.js for Wordledraw

const VALID_WORDS = [];
let answer = "";

// Load valid words from the text file into the array
fetch('./valid-wordle-words.txt')
    .then(response => response.text())
    .then(text => {
        VALID_WORDS.push(...text.split('\n').map(word => word.trim()).filter(Boolean));
        console.log('Words loaded.');
    })
    .catch(error => {
        console.error('Error loading the words:', error);
    });

document.getElementById('set-button').addEventListener('click', () => {
    // Check if input is valid
    let input = document.getElementById('wordle-answer-input').value;
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

function get_word(wanted_colours) {
    if (!Array.isArray(wanted_colours) || wanted_colours.length !== 5) {
        return null;
    }

    for (let i = 0; i < VALID_WORDS.length; i++) {
        let word = VALID_WORDS[i];
        if (get_colours(word).every((colour, index) => colour === wanted_colours[index])) {
            return word;
        }
    }

    return null;
}