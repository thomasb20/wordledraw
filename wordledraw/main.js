// main.js for Wordledraw

const VALID_WORDS = [];
let answer = "";

// Load valid words from the text file into the array
fetch('./valid-wordle-words.txt')
    .then(response => response.text())
    .then(text => {
        VALID_WORDS.push(...text.split('\n').map(word => word.trim()));
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
    let colours = [];
    let word_letters = word.split('');
    let answer_letters = answer.split('');

    for (let i = 0; i < word_letters.length; i++) {
        let curr_word_letter = word_letters[i];
        let curr_answer_letter = answer_letters[i];
        if (curr_word_letter = curr_answer_letter) {
            colours.push("green");
        }
        else if (answer_letters.includes(curr_word_letter)) {
            colours.push("yellow");
        }
        else{
            colours.push("grey");
        }
    }

    return colours;
}