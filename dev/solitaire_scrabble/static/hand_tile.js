export function setupHandTile(element, letter, value, letter_score) {

    const setHandTile = () => {
        element.innerHTML = `
            <div class="hand-tile">
                ${letter}
                <span class="hand-tile-score">${letter_score}</span>
            </div>
        `;
    }

    element.setAttribute('draggable', 'true')

    const payload = { letter, value }

    element.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(payload))
    })

    element.addEventListener('dragend', (e) => {
        e.preventDefault()
        element.innerHTML = ``;
    })

    setHandTile()
}