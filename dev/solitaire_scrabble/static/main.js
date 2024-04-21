import { setupBoard } from "./board.js";
import { setupWordScore } from "./word_score.js";
import { setupScore } from "./score.js";
import { setupHand } from "./hand.js";
import { setupGamesHistory } from "./games_history.js";
import { setupStartButton } from "./start_button.js";
import { setupNav } from "./nav.js";
import { setupSequence } from "./sequence.js";
import { setupControls } from "./controls.js";
import { setupLeaderboard } from "./leaderboard.js";

if (game) {
    document.querySelector('#app').innerHTML = /*html*/ `
        <div class="game">
            <div id='nav'></div>
            <div id="board"></div>
            <div id="word-score"></div>
            <div id="score"></div>
            <div id="hand"></div>
            <div id='sequence'></div>
            <div id='controls'></div>
            <div id='leaderboard'></div>
        </div>
    `;

    setupBoard(document.querySelector('#board'))
    setupWordScore(document.querySelector('#word-score'))
    setupScore(document.querySelector('#score'))
    setupHand(document.querySelector('#hand'))
    setupSequence(document.querySelector(`#sequence`))
    setupControls(document.querySelector('#controls'))
    
} else {

    document.querySelector('#app').innerHTML = /*html*/ `
        <div class="game">
            <div id='nav'></div>
            <div id="start-button"></div>
            <div id="games-history"></div>
            <div id='leaderboard'></div>
        </div>
    `;
    setupStartButton(document.querySelector('#start-button'));
    setupGamesHistory(document.querySelector('#games-history'));
}

setupNav(document.querySelector('#nav'));
setupLeaderboard(document.querySelector('#leaderboard'));