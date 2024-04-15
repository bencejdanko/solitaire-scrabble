import { setupBoard } from "./board.js";
import { setupWordScore } from "./word_score.js";
import { setupScore } from "./score.js";
import { setupHand } from "./hand.js";

import { setupStartButton } from "./start_button.js";

const game_id = null;

if (game_id) {
    document.querySelector('#app').innerHTML = /*html*/ `
        <div class="game">
            <div id="board"></div>
            <div id="word-score"></div>
            <div id="score"></div>
            <div id="hand"></div>
        </div>
    `;

    setupBoard(document.querySelector('#board'), board)
    setupWordScore(document.querySelector('#word-score'), 0)
    setupScore(document.querySelector('#score'), score)
    setupHand(document.querySelector('#hand'), hand)
    
} else {

    document.querySelector('#app').innerHTML = /*html*/ `
        <div class="game">
            <div id="start-button"></div>
        </div>
    `;

    setupStartButton(document.querySelector('#start-button'));
}

