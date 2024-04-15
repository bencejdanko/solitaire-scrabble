import { setupHandTile } from './hand_tile.js';

export function setupHand(element, hand) {
    const setHand = (hand) => {
        const tilesHTML = hand.map((tile, i) => `
            <div id="hand-tile-${i}"></div>
        `).join('');

        element.innerHTML = tilesHTML;

        console.log(hand)
        // Now query and setup tiles
        hand.forEach((tile, i) => {
            setupHandTile(document.querySelector(`#hand-tile-${i}`), tile, i);
        });
    }

    setHand(hand);
}