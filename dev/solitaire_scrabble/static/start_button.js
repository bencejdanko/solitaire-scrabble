async function startNewGame() {

    const response = await fetch(url + '/game/new_game', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const gameResponse = await response.json();
    localStorage.setItem('game', gameResponse.game);
    window.location.reload();
    
}

export function setupStartButton(element) {
    const setStartButton = () => {
        element.innerHTML = `
            <button class="start-button">Start Game</button>
        `;

        document.querySelector('#start-button').addEventListener('click', async () => {
            await startNewGame();
        });
    }

    setStartButton();
}