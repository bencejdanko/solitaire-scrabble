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
import { setupPlayedWords } from "./played_words.js";

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
        let context;
        try {
            context = JSON.parse(atob(payload));
        } catch (e) {
            console.error(e);
            console.log("Invalid game! Clearing...")
            localStorage.removeItem('game');
            window.location.reload();
        }

        /**
         * Game context attributes:
         * board, hand, sequence, score, played_words, complete, username, user_id, played
         */
        context.username = username
        context.user_id = user_id
        context.played = Array(context.board.length);

        document.querySelector('#app').innerHTML = `
            <div id='nav'></div>
            <div class='content'>
                <div class='board-content'>
                    <div id="board"></div>
                    <div id='played-words'></div>
                </div>

                <div id="message"></div>
                <!-- <div id="word-score"></div> -->
                <div id="score"></div>
                <div id="hand"></div>
                <div id='sequence'></div>
                <div id='controls'></div>
            </div>
        `;

        setupAppElements(context);

    } else {
        document.querySelector('#app').innerHTML = `
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

        let empty_context = {};
        empty_context.username = username
        setupAppElements(empty_context);
        document.querySelector('#app').style.opacity = '1';
    }

}

export function setupAppElements(context) {

    const elements = {
        '#nav': setupNav,
        '#leaderboard': setupLeaderboard,
        '#start-button': setupStartButton,
        '#rules': setupRules,
        '#board': setupBoard,
        '#score': setupScore,
        '#hand': setupHand,
        '#sequence': setupSequence,
        '#controls': setupControls,
        '#message': setupMessage,
        '#played-words': setupPlayedWords
    };

    const setupElement = (selector, context) => {
        let element = document.querySelector(selector)
        if (element) {
            elements[selector](element, context)
        }
    }

    context.setupElement = setupElement

    Object.keys(elements).forEach(selector => {
        setupElement(selector, context)
    });

}

setupApp()