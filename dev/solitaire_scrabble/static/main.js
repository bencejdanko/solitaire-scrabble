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
import { setupRules } from "./rules.js";
import { setupStartDaily } from './start_daily.js'

export function setupApp() {

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
            <div id='nav'></div>
            <div class='content'>
                <div id="board"></div>
                <div id="message"></div>
                <!-- <div id="word-score"></div> -->
                <div id="score"></div>
                <div id="hand"></div>
                <div id='sequence'></div>
                <div id='controls'></div>
            </div>
        `;

        setupAppElements(username, board, hand, sequence, score, played);

    } else {
        document.querySelector('#app').innerHTML = /*html*/ `
        <div id='nav'></div>
        <div class='content'>
            <div class='title'>Worditaire</div>
            <div class='subtitle'>A casual vocabulary game</div>
            <div class='index-controls'>
                <div id="start-button"></div>
                <div id="rules"></div>
                <!-- <div id='start-daily'></div> -->
            </div>
            <!-- <div id="games-history"></div> -->
            <!-- <div id='leaderboard'></div> -->
        </div>
        `;

        setupAppElements(username, [], [], [], 0, []);
        document.querySelector('#app').style.opacity = '1';
    }

}

export function setupAppElements(username, board, hand, sequence, score, played) {
    console.log()

    if (document.querySelector('#nav')) {
        setupNav(document.querySelector('#nav'), username);
    }

    if (document.querySelector('#leaderboard')) {
        setupLeaderboard(document.querySelector('#leaderboard'));
    }

    if (document.querySelector('#start-button')) {
        setupStartButton(document.querySelector('#start-button'));
    }

    if (document.querySelector('#rules')) {
        setupRules(document.querySelector('#rules'))
    }

    if (document.querySelector('#board')) {
        setupBoard(document.querySelector('#board'), board, played)
    }

    if (document.querySelector('#score')) {
        setupScore(document.querySelector('#score'), score)
    }

    if (document.querySelector('#hand')) {
        setupHand(document.querySelector('#hand'), hand, played)
    }

    if (document.querySelector(`#sequence`)) {
        setupSequence(document.querySelector(`#sequence`), sequence)
    }

    if (document.querySelector('#controls')) {
        setupControls(document.querySelector('#controls'), played)
    }

    if (document.querySelector('#message')) {
        setupMessage(document.querySelector('#message'))
    }

    // if (document.querySelector('#games-history')) {
    //     setupGamesHistory(document.querySelector('#games-history'));
    // }

    // if (document.querySelector('#start-daily')) {
    //     setupStartDaily(document.querySelector('#start-daily'));
    // }
    //setupWordScore(document.querySelector('#word-score'))

}

setupApp()