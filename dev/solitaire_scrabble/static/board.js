import { setupBoardTile } from "./board_tile.js"

export function setupBoard(element) {
    const setBoard = () => {
        const tilesHTML = board.map((tile, i) => `
            <div id="tile-${i}"></div>
        `).join('');

        element.innerHTML =
            tilesHTML
            ;

        // Now query and setup tiles
        board.forEach((tile, i) => {
            setupBoardTile(document.querySelector(`#tile-${i}`), tile);
        });
    }

    setBoard();
}