async function getGames() {
    let data = await fetch('/games/' + user_id);
    return data.json();
}

async function setGameSession(game_id) {
    let data = await fetch('/game/' + game_id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id
        })

    });
    return data.json();
}

export async function setupGamesHistory(element) {
    const setGamesHistory = async () => {

        let headerHTML = `
        <table>

        <tr>
        <td>Game</td>
        <td>Score</td>
        <td>Status </td>
        </tr> `

        games = await getGames();
        console.log(games)

        const gamesHTML = games.map((game, i) => `
            <tr>
            <td>${game.game_id}</td>
            <td>${game.score}</td>
            <td>${game.status}</td>
            </tr>
        `).join('');


        element.innerHTML = headerHTML + gamesHTML + `</table>`;

    }

    await setGamesHistory();
}