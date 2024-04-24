import { setupBoardTile } from "./board_tile.js"

export function setupBoard(element, board=[], played) {

    const setBoard = (letter_scores) => {
        const tilesHTML = board.map((tile, i) => `
            <div id="tile-${i}" class="board-tile"></div>
            </div>
        `).join('');

        element.innerHTML =
            tilesHTML
            ;

        // Now query and setup tiles
        board.forEach((tile, i) => {
            setupBoardTile(document.querySelector(`#tile-${i}`), tile, i, played);
        });
    }


    setBoard();
}