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

        boardTile.classList.add('quick-pop-animation');
        boardTile.classList.add('filled-board-tile')

        // Remove the tile after animation ends
        element.addEventListener('animationend', () => {
            element.innerHTML = '<div> t </div>';
        }, { once: true });

        
    })

    setHandTile()
}