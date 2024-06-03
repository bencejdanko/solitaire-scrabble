import { setupHandTile } from './hand_tile.js';

let letter_scores = {
    'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1,
    'f': 4, 'g': 2, 'h': 4, 'i': 1, 'j': 8,
    'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1,
    'p': 3, 'q': 10, 'r': 1, 's': 1, 't': 1,
    'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4,
    'z': 10
}

export function setupHand(element, hand = [], played) {

    const clear = () => {
        fetch(url + '/game/letter_scores')
            .then(response => response.json())
            .then(data => {
                setHand(data);
            })
    }

    const shuffle = () => {
        for (let i = hand.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [hand[i], hand[j]] = [hand[j], hand[i]];
        }
        fetch(url + '/game/letter_scores')
            .then(response => response.json())
            .then(data => {
                setHand(data);
            })
    }

    const setHand = (letter_scores) => {
        const tilesHTML = hand.map((tile, i) => `
            <div id="hand-tile-${i}"></div>
        `).join('');

        element.innerHTML = tilesHTML;

        const controlsHTML0 = `
            <button id='clear'>clear</button>
        `

        const controlsHTML1 = `
            <button id='shuffle'>shuffle</button>
        `

        element.innerHTML = controlsHTML0 + tilesHTML + controlsHTML1

        // Now query and setup tiles
        hand.forEach((tile, i) => {
            setupHandTile(document.querySelector(`#hand-tile-${i}`), tile, i, letter_scores[tile], played);
        });

        document.querySelector('#clear').addEventListener('click', clear);
        document.querySelector('#shuffle').addEventListener('click', shuffle);

    }

    fetch(url + '/game/letter_scores')
        .then(response => response.json())
        .then(data => {
            setHand(data);
        })
}