
export function setupBoardTile(element, value, id, played) {

    const setTile = (value) => {
        if (value) {
            element.setAttribute('style', 'background-color: var(--green1);')
        }

        element.innerHTML = `
            <span class="tile-value">${value ? value : ''}</span>
        `;

    }

    setTile(value)
}