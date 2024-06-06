import { setupBoardTile } from "./board_tile.js"

export function setupBoard(element, context) {

    const setBoard = (letter_scores) => {
        const tilesHTML = context.board.map((tile, i) => `
            <div id="tile-${i}" class="board-tile"></div>
            </div>
        `).join('');

        element.innerHTML = tilesHTML;

        // Now query and setup tiles
        context.board.forEach((tile, i) => {
            setupBoardTile(document.querySelector(`#tile-${i}`), tile, i, context.played);
        });
    }

    setBoard();
    element.innerHTML = ` <div class='board-grid'> ${element.innerHTML} </div>`
}

export function updateBoard(idx, played) {
    let updatedTile = document.querySelector(`#tile-${idx}`)

}