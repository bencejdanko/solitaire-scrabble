async function startNewGame() {

    await fetch('/new_game/' + user_id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id
        })
    });

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