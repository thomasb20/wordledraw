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