// main.js for Wordledraw

const VALID_WORDS = [];

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