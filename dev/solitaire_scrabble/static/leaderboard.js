let users = []

export function setupLeaderboard(element) {
    const setLeaderboard = () => {
        element.innerHTML = `
            <table>
                <tr>
                    <th>Username</th>
                    <th>Score</th>
                </tr>

                ${users.map((entry) => `
                    <tr>
                        <td>${entry.username}</td>
                        <td>${entry.score}</td>
                    </tr>
                `).join('')}
    
            </table>
        `
    }

    fetch(url + '/game/users')
    .then(response => response.json())
    .then(data => {
        users = data.users
        setLeaderboard()
    })
}