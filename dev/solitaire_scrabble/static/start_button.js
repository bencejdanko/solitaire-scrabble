import { fetchGame } from "./query.js";

export function setupStartButton(element) {
    const setStartButton = () => {
        element.innerHTML = `
            <button class="start-button">Start Game</button>
        `;

        document.querySelector('#start-button').addEventListener('click', async () => {
            await fetchGame();
        });
    }

    setStartButton();
}