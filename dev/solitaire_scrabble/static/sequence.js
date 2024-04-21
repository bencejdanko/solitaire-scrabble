import { setupSequenceTile } from "./sequence_tile.js";

export function setupSequence(element) {
    const setSequence = () => {
        const tilesHTML = sequence.map((tile, i) => `
            <div id='sequence-tile-${i}'></div>
        `).join('');

        element.innerHTML = tilesHTML

        sequence.forEach((tile, i) => {
            setupSequenceTile(document.querySelector(`#sequence-tile-${i}`), tile, i)
        })
    }

    setSequence()
}