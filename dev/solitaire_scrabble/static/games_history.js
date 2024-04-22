async function getGames() {
    let games = await fetch('/games/' + user_id);

    if (!games.ok) {
        return [];
    }

    return games.json();
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

        let games = [ 
            {game_id: 1, score: 100, status: 0}, 
            {game_id: 2, score: 200, status: 1} 
            
       ]   // await getGames();

        const gamesHTML = games.map((game, i) => `
            <tr>
            <td>${game.game_id}</td>
            <td>${game.score}</td>
            <td>${game.status === 0 ? 'Done' : '<button>Continue</button>'}</td>
            </tr>
        `).join('');


        element.innerHTML = headerHTML + gamesHTML + `</table>`;

    }

    await setGamesHistory();
}