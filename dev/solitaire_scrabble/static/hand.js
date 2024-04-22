import { setupHandTile } from './hand_tile.js';

let letter_scores = {
    'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1,
    'f': 4, 'g': 2, 'h': 4, 'i': 1, 'j': 8,
    'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1,
    'p': 3, 'q': 10, 'r': 1, 's': 1, 't': 1,
    'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4,
    'z': 10
}

export function setupHand(element, hand = []) {
    const setHand = (letter_scores) => {
        const tilesHTML = hand.map((tile, i) => `
            <div id="hand-tile-${i}"></div>
        `).join('');

        element.innerHTML = tilesHTML;

        // Now query and setup tiles
        hand.forEach((tile, i) => {
            setupHandTile(document.querySelector(`#hand-tile-${i}`), tile, i, letter_scores[tile]);
        });
    }

    fetch(url + '/game/letter_scores')
    .then(response => response.json())
    .then(data => {
        setHand(data);
    })
}