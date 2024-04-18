import { setupBoard } from "./board.js";
import { setupWordScore } from "./word_score.js";
import { setupScore } from "./score.js";
import { setupHand } from "./hand.js";
import { setupGamesHistory } from "./games_history.js";

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

    setupBoard(document.querySelector('#board'))
    setupWordScore(document.querySelector('#word-score'))
    setupScore(document.querySelector('#score'))
    setupHand(document.querySelector('#hand'))
    
} else {

    document.querySelector('#app').innerHTML = /*html*/ `
        <div class="game">
            <div id="start-button"></div>
            <div id="games-history"></div>
        </div>
    `;

    setupStartButton(document.querySelector('#start-button'));
    setupGamesHistory(document.querySelector('#games-history'));
}

