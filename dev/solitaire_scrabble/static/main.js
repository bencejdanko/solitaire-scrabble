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
            <div id="board"></div>
            <div id="message"></div>
            <!-- <div id="word-score"></div> -->
            <div id="score"></div>
            <div id="hand"></div>
            <div id='sequence'></div>
            <div id='controls'></div>
        `;

        setupAppElements(username, board, hand, sequence, score, played);

    } else {
        document.querySelector('#app').innerHTML = /*html*/ `
        <div id='nav'></div>
        <div class='content'>
            <div class='logo'>
                <svg version="1.1" viewBox="0.0 0.0 265.15223097112863 250.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l265.15222 0l0 250.0l-265.15222 0l0 -250.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#000000" fill-opacity="0.0" d="m0 0l265.15222 0l0 250.0l-265.15222 0z" fill-rule="evenodd"/><path fill="#52fa7c" d="m91.99446 38.493965l0 0c0 -14.51045 11.763046 -26.273493 26.27349 -26.273493l110.0357 0l0 0c6.96817 0 13.650925 2.7680922 18.57817 7.6953278c4.927231 4.9272346 7.6953125 11.610001 7.6953125 18.578165l0 105.09081c0 14.510452 -11.763031 26.273483 -26.273483 26.273483l-110.0357 0c-14.510445 0 -26.27349 -11.763031 -26.27349 -26.273483z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="12.0" stroke-linejoin="round" stroke-linecap="butt" d="m91.99446 38.493965l0 0c0 -14.51045 11.763046 -26.273493 26.27349 -26.273493l110.0357 0l0 0c6.96817 0 13.650925 2.7680922 18.57817 7.6953278c4.927231 4.9272346 7.6953125 11.610001 7.6953125 18.578165l0 105.09081c0 14.510452 -11.763031 26.273483 -26.273483 26.273483l-110.0357 0c-14.510445 0 -26.27349 -11.763031 -26.27349 -26.273483z" fill-rule="evenodd"/><path fill="#ff5757" d="m53.669003 70.74856l0 0c0 -14.510448 11.763042 -26.27349 26.273495 -26.27349l110.0357 0l0 0c6.968155 0 13.650925 2.7680893 18.578156 7.6953278c4.927246 4.9272346 7.6953278 11.610001 7.6953278 18.578163l0 105.09081c0 14.510452 -11.763046 26.273483 -26.273483 26.273483l-110.0357 0c-14.510452 0 -26.273495 -11.763031 -26.273495 -26.273483z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="12.0" stroke-linejoin="round" stroke-linecap="butt" d="m53.669003 70.74856l0 0c0 -14.510448 11.763042 -26.27349 26.273495 -26.27349l110.0357 0l0 0c6.968155 0 13.650925 2.7680893 18.578156 7.6953278c4.927246 4.9272346 7.6953278 11.610001 7.6953278 18.578163l0 105.09081c0 14.510452 -11.763046 26.273483 -26.273483 26.273483l-110.0357 0c-14.510452 0 -26.273495 -11.763031 -26.273495 -26.273483z" fill-rule="evenodd"/><path fill="#ffb86b" d="m8.629634 110.17638l0 0c0 -14.510445 11.763043 -26.27349 26.27349 -26.27349l110.035706 0l0 0c6.968155 0 13.650925 2.768097 18.578156 7.6953278c4.927231 4.9272385 7.6953278 11.610001 7.6953278 18.578163l0 105.09082c0 14.510437 -11.763046 26.273483 -26.273483 26.273483l-110.035706 0c-14.510448 0 -26.27349 -11.763046 -26.27349 -26.273483z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="12.0" stroke-linejoin="round" stroke-linecap="butt" d="m8.629634 110.17638l0 0c0 -14.510445 11.763043 -26.27349 26.27349 -26.27349l110.035706 0l0 0c6.968155 0 13.650925 2.768097 18.578156 7.6953278c4.927231 4.9272385 7.6953278 11.610001 7.6953278 18.578163l0 105.09082c0 14.510437 -11.763046 26.273483 -26.273483 26.273483l-110.035706 0c-14.510448 0 -26.27349 -11.763046 -26.27349 -26.273483z" fill-rule="evenodd"/><path fill="#000000" fill-opacity="0.0" d="m29.160105 97.543304l99.43307 0l0 143.81102l-99.43307 0z" fill-rule="evenodd"/><path fill="#000000" d="m72.55073 206.74393q-0.203125 0 -0.625 -0.921875q-0.40625 -0.921875 -0.8125 -1.953125l-22.171871 -55.640625q-1.234375 -2.671875 -2.984375 -4.359375q-1.734375 -1.6875 -4.40625 -2.40625q-1.640625 -0.515625 -2.515625 -1.03125q-0.875 -0.515625 -0.875 -1.234375q0 -0.609375 0.8125 -0.859375q0.828125 -0.265625 2.171875 -0.265625q2.359375 0 4.453125 0.15625q2.109375 0.140625 4.671875 0.140625q2.875 0 5.4375 -0.09375q2.578125 -0.109375 4.109375 -0.109375q1.34375 0 2.15625 0.265625q0.828125 0.25 0.828125 0.875q0 0.71875 -0.828125 1.125q-0.8125 0.40625 -2.5625 0.921875q-1.234375 0.3125 -1.640625 1.296875q-0.40625 0.96875 -0.40625 2.09375q0 1.640625 0.40625 3.03125q0.40625 1.375 0.40625 1.375q2.359375 5.953125 4.3125 10.890625q1.9531212 4.921875 3.8437462 9.5q1.90625 4.5625 4.0 9.34375q2.109375 4.765625 4.6875 10.609375q0.5 1.140625 0.859375 1.03125q0.359375 -0.109375 0.671875 -0.921875l8.015625 -19.8125q0.296875 -0.828125 0.453125 -1.390625q0.15625 -0.5625 0.15625 -0.96875q0 -0.625 -0.203125 -1.28125q-0.203125 -0.671875 -0.609375 -1.703125l-5.859375 -14.578125q-1.328125 -3.28125 -4.203125 -5.484375q-2.875 -2.203125 -5.546875 -2.921875q-1.640625 -0.515625 -2.515625 -1.03125q-0.875 -0.515625 -0.875 -1.234375q0 -0.609375 0.8125 -0.859375q0.828125 -0.265625 2.171875 -0.265625q1.640625 0 3.125 0.109375q1.484375 0.09375 3.078125 0.140625q1.59375 0.046875 3.4375 0.046875q2.359375 0 4.359375 -0.09375q2.015625 -0.109375 3.546875 -0.109375q1.328125 0 2.15625 0.265625q0.828125 0.25 0.828125 0.875q0 0.8125 -1.03125 1.328125q-1.03125 0.515625 -2.109375 1.140625q-1.078125 0.609375 -1.078125 1.84375q0 0.203125 0.046875 0.40625q0.0625 0.203125 0.15625 0.40625q0.203125 0.40625 0.765625 2.0q0.578125 1.59375 1.34375 3.546875q0.765625 1.953125 1.484375 3.65625q0.71875 1.6875 1.03125 2.40625q0.515625 1.21875 0.875 1.28125q0.359375 0.046875 0.96875 -1.28125q0.828125 -1.859375 1.703125 -4.21875q0.875 -2.359375 1.53125 -4.453125q0.671875 -2.109375 0.875 -2.9375q0.109375 -0.3125 0.109375 -0.71875q0 -1.234375 -0.9375 -1.84375q-0.921875 -0.625 -1.890625 -1.1875q-0.96875 -0.5625 -0.96875 -1.375q0 -0.625 0.8125 -0.875q0.828125 -0.265625 2.15625 -0.265625q2.265625 0 3.078125 0.109375q0.828125 0.09375 2.265625 0.09375q1.734375 0 2.96875 -0.140625q1.234375 -0.15625 3.078125 -0.15625q1.34375 0 2.15625 0.265625q0.828125 0.25 0.828125 0.859375q0 0.71875 -0.828125 1.1875q-0.8125 0.453125 -2.5625 0.859375q-3.28125 0.71875 -4.46875 1.75q-1.171875 1.03125 -2.515625 3.1875q-0.515625 0.921875 -1.484375 3.078125q-0.96875 2.15625 -2.046875 4.71875q-1.078125 2.5625 -1.90625 4.828125q-0.3125 0.71875 -0.5625 2.0625q-0.25 1.328125 -0.046875 1.84375l10.5625 27.203125q0.21875 0.5 0.515625 0.296875q0.3125 -0.203125 0.625 -0.921875q2.5625 -6.765625 5.796875 -17.34375q3.234375 -10.578125 6.71875 -22.375q0.3125 -0.9375 0.46875 -1.90625q0.15625 -0.96875 0.15625 -1.796875q0 -1.53125 -0.671875 -2.765625q-0.671875 -1.234375 -2.40625 -1.640625q-1.03125 -0.3125 -2.21875 -0.828125q-1.171875 -0.515625 -1.171875 -1.234375q0 -0.609375 0.8125 -0.859375q0.828125 -0.265625 2.15625 -0.265625q2.0625 0 3.75 0.046875q1.6875 0.046875 3.640625 0.046875q2.578125 0 4.9375 -0.140625q2.3593826 -0.15625 4.3125076 -0.15625q1.328125 0 2.140625 0.265625q0.828125 0.25 0.828125 0.859375q0 0.71875 -0.828125 1.1875q-0.8125 0.453125 -2.5625 0.859375q-2.4531326 0.515625 -4.1562576 2.109375q-1.6875 1.59375 -2.671875 3.5q-0.96875 1.890625 -1.578125 3.4375l-18.171875 53.6875q-0.109375 0.40625 -0.625 1.375q-0.515625 0.984375 -1.015625 0.984375q-0.421875 0 -0.9375 -0.625q-0.5 -0.609375 -0.8125 -1.328125q-2.671875 -6.15625 -4.625 -11.03125q-1.953125 -4.875 -3.75 -9.796875q-1.796875 -4.9375 -4.25 -10.890625q-0.3125 -0.71875 -0.515625 -0.5625q-0.203125 0.15625 -0.625 1.171875q-2.453125 5.859375 -4.25 10.375q-1.796875 4.515625 -3.546875 9.1875q-1.75 4.671875 -3.90625 10.71875q-0.40625 1.03125 -1.03125 2.109375q-0.609375 1.078125 -1.21875 1.078125z" fill-rule="nonzero"/></g></svg>
            </div>
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
        setupHand(document.querySelector('#hand'), hand)
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