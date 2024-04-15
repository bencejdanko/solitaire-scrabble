export function clearSession() {
    response = fetch('/game/clear', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network error');
            }

            location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

/**
 * Requests a new game from the server. A session associated with the user is initiated,
 * and `game_id` is stored in the session, and accessible to the client.
 */
export function fetchGame() {
    response = fetch('/game/start', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network error');
            }

            location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export function refreshGame(game_id) {
    let response = fetch('/game/' + game_id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

        .then(response => {
            if (!response.ok) {
                throw new Error('Network error');
            }
            return response.json();
        })
        .then(data => {

            console.log(data)
            hand = data.hand;
            board = data.board;
            sequence = data.sequence;
            tile_scores = data.tile_scores;
            current_score = data.score
            updateHand();
            updateBoard();
            updateWordScore();
            updateSequence();
            updateCurrentScore()
            document.getElementsByClassName('error')[0].innerHTML = "";

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
