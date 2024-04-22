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
import { setupMessage } from "./message.js";

const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
const user = userCookie ? userCookie.split('=')[1] : null;

let username,
    user_id

if (!user) {
    username = null
    user_id = null
} else {
    try {
        const payload = user.split('.')[1]
        const decoded = atob(payload)
        const info = JSON.parse(decoded)
        username = info.username
        user_id = info.user_id
    } catch (error) {
        console.log(error)
    }
}

let game = localStorage.getItem('game');

if (game) {

    const payload = game.split('.')[1];
    let info;
    try {
        info = JSON.parse(atob(payload));
    } catch (e) {
        console.error(e);
        console.log("Invalid game! Clearing...")
        localStorage.removeItem('game');
        window.location.reload();
    }

    let { board, hand, sequence, score, played_words, complete } = info;
    let played = Array(board.length);

    document.querySelector('#app').innerHTML = /*html*/ `
        <div class="game">
            <div id='nav'></div>
            <div id="board"></div>
            <div id="message"></div>
            <!-- <div id="word-score"></div> -->
            <div id="score"></div>
            <div id="hand"></div>
            <div id='sequence'></div>
            <div id='controls'></div>
            <div id='leaderboard'></div>
        </div>
    `;

    setupBoard(document.querySelector('#board'), board, played)
    //setupWordScore(document.querySelector('#word-score'))
    setupScore(document.querySelector('#score'), score)
    setupHand(document.querySelector('#hand'), hand)
    setupSequence(document.querySelector(`#sequence`), sequence)
    setupControls(document.querySelector('#controls'), played)

} else {

    document.querySelector('#app').innerHTML = /*html*/ `
        <div class="game">
            <div id='nav'></div>
            <div id="start-button"></div>
            <div id="message"></div>
            <!-- <div id="games-history"></div> -->
            <div id='leaderboard'></div>
        </div>
    `;
    setupStartButton(document.querySelector('#start-button'));
    // setupGamesHistory(document.querySelector('#games-history'));
}

setupNav(document.querySelector('#nav'), username);
setupLeaderboard(document.querySelector('#leaderboard'));