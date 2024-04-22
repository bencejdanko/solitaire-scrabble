import { setupSequenceTile } from "./sequence_tile.js";

let letter_scores = {
    'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1,
    'f': 4, 'g': 2, 'h': 4, 'i': 1, 'j': 8,
    'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1,
    'p': 3, 'q': 10, 'r': 1, 's': 1, 't': 1,
    'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4,
    'z': 10
}

export function setupSequence(element, sequence = []) {
    const setSequence = (letter_scores) => {
        const tilesHTML = sequence.map((tile, i) => `
            <div id='sequence-tile-${i}'></div>
        `).join('');

        element.innerHTML = tilesHTML

        sequence.forEach((tile, i) => {
            setupSequenceTile(document.querySelector(`#sequence-tile-${i}`), tile, i, letter_scores[tile])
        })
    }

    fetch(url + '/game/letter_scores')
    .then(response => response.json())
    .then(data => {
        setSequence(data)
    })
}