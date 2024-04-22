
export function setupBoardTile(element, value, id, played) {

    const setTile = (value) => {

        element.innerHTML = `
            <div class="board-tile" style='${value ? "background-color: #3afd47be" : ""}'>
            <span class="tile-value">${value ? value : ''}</span>
            </div>
        `;
    }

    setTile(value)

    element.addEventListener('dragover', (e) => {
        e.preventDefault();
    })

    element.addEventListener('drop', (e) => {
        e.preventDefault();
        let data = e.dataTransfer.getData('text/plain')
        let letter = JSON.parse(data).letter
        let value = JSON.parse(data).value
        played[id] = { letter, value }
        console.log(played)
        setTile(letter)
    })
}