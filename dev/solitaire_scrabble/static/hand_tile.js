export function setupHandTile(element, letter, value) {
    const setHandTile = () => {
        element.innerHTML = `
            <div class="hand-tile">
                ${letter}
                <span class="hand-tile-score">${value}</span>
            </div>
        `;
    }

    element.setAttribute('draggable', 'true')

    element.addEventListener('dragstart', (e) => {

    })

    element.addEventListener('dragend', (e) => {

    })

    setHandTile()
}