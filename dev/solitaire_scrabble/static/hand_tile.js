export function setupHandTile(element, letter, value, letter_score, played) {

    const setHandTile = () => {
        element.innerHTML = `
            <div class="hand-tile">
                ${letter}
                <span class="hand-tile-score">${letter_score}</span>
            </div>
        `;
    }

    element.addEventListener('click', (e) => {
        let idx = played.findIndex(tile => tile === undefined)
        if (idx === -1) {
            return
        }
        played[idx] = { letter, value }
        
        let boardTile = document.querySelector(`#tile-${idx}`)
        boardTile.innerHTML = `
            <span class="tile-value">${letter}</span>
        `;
        
        element.classList.add('pop-animation');
        boardTile.classList.add('pop-animation');

        // Remove the tile after animation ends
        element.addEventListener('animationend', () => {
            element.innerHTML = '';
        }, { once: true });

        
    })

    setHandTile()
}