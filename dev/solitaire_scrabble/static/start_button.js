import { setupApp } from "./main.js";

async function startNewGame() {

    const response = await fetch(url + '/game/new_game', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const gameResponse = await response.json();
    localStorage.setItem('game', gameResponse.game);
    setupApp();
    const app = document.querySelector('#app');
    app.style.animation = 'none';
    app.offsetHeight;
    app.style.opacity = 0;
    app.style.animation = 'fadeInAnimation ease 3s';
    
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