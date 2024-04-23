import { setupMessage } from "./message.js"

export function setupControls(element, played) {

    async function submit() {
        let played_word = ''
        for (let i = 0; i < played.length; i++) {
            if (played[i]) {
                played_word += played[i].letter
            } else {
                break
            }
        }

        let response = await fetch(url + '/game/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                game: localStorage.getItem('game'),
                word: played_word
            })
        })

        let data = await response.json()

        if (!response.ok) {
            setupMessage(document.querySelector('#message'), { status: 4, message: data.message })
            throw new Error(message);
        }

        localStorage.setItem('game', data.game)
        window.location.reload()

    }

    async function hint() {
        let response = await fetch(url + '/game/hint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                game: localStorage.getItem('game')
            })
        })

        let data = await response.json()

        if (!response.ok) {
            setupMessage(document.querySelector('#message'), { status: 4, message: data.message })
            throw new Error(message);
        }

        setupMessage(document.querySelector('#message'), { status: 2, message: data.score + ' ' + data.word })
    }

    async function complex_hint() {
        let response = await fetch(url + '/game/complex_hint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                game: localStorage.getItem('game')
            })
        })

        let data = await response.json()

        if (!response.ok) {            
            setupMessage(document.querySelector('#message'), { status: 4, message: data.message })
            throw new Error(message);
        }

        console.log(data)

        setupMessage(document.querySelector('#message'), { status: 2, message:  data.max_result + ' ' + data.max_words })
    }

    async function restart() {

        console.log(localStorage.getItem('game'));

        const response = await fetch(url + '/game/restart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                game: localStorage.getItem('game')
            })
        });

        let data = await response.json();

        if (!response.ok) {
            setupMessage(document.querySelector('#message'), { status: 4, message: data.message })
            throw new Error(message);
        }

        localStorage.setItem('game', data.game);
        window.location.reload();
    }

    async function clear() {
        window.location.reload();
    }

    async function finish() {

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

        const response = await fetch(url + '/game/finish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                game: localStorage.getItem('game'),
                user_id: user_id
            })
        });

        let data = await response.json();

        if (!response.ok) {
            setupMessage(document.querySelector('#message'), { status: 4, message: data.message })
            throw new Error(message);
        }

        localStorage.removeItem('game');
        window.location.reload();
    }

    function new_game() {
        localStorage.removeItem('game');
        window.location.reload();
    }

    const setControls = () => {
        element.innerHTML = `
            <div class="controls">
                <button id='submit'>submit</button>
                <button id='restart'>restart</button>
                <button id='new_game'>new game</button>
                <button id='finish'>finish</button>
                <button id='clear'>clear</button>
                <button id='hint'>hint</button>
                <button id='complex_hint'>complex hint</button>
            </div>
        `;

        document.querySelector('#submit').addEventListener('click', submit);
        document.querySelector('#restart').addEventListener('click', restart);
        document.querySelector('#new_game').addEventListener('click', new_game);
        document.querySelector('#finish').addEventListener('click', finish);
        document.querySelector('#clear').addEventListener('click', clear);
        document.querySelector('#hint').addEventListener('click', hint);
        document.querySelector('#complex_hint').addEventListener('click', complex_hint);
    }

    setControls()
}