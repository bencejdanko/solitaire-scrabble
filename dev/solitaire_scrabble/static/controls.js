export function setupControls(element) {
    
    function submit() {

    }

    async function clear() {

        console.log(localStorage.getItem('game'));

        const response = await fetch(url + '/game/clear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                game: localStorage.getItem('game')
            })
        });

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }

        const gameResponse = await response.json();
        localStorage.setItem('game', gameResponse.game);
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
            </div>
        `;

        document.querySelector('#submit').addEventListener('click', submit);
        document.querySelector('#restart').addEventListener('click', clear);
        document.querySelector('#new_game').addEventListener('click', new_game);
    }

    setControls()
}