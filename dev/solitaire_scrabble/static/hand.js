import { setupHandTile } from './hand_tile.js';

export function setupHand(element) {
    const setHand = () => {
        const tilesHTML = hand.map((tile, i) => `
            <div id="hand-tile-${i}"></div>
        `).join('');

        element.innerHTML = tilesHTML;

        // Now query and setup tiles
        hand.forEach((tile, i) => {
            setupHandTile(document.querySelector(`#hand-tile-${i}`), tile, i);
        });
    }

    setHand(hand);
}