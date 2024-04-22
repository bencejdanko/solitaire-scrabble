
export function setupBoardTile(element, value, id, played) {

    let occupied = false

    const setTile = (value) => {
        if (value) {
            element.setAttribute('style', 'background-color: #3afd47be')
        }

        element.innerHTML = `
            <span class="tile-value">${value ? value : ''}</span>
        `;
    }

    setTile(value)

    element.setAttribute('draggable', 'true')

    element.addEventListener('dragover', (e) => {
        e.preventDefault();
    })

    element.addEventListener('drop', (e) => {
        e.preventDefault();
        let data = e.dataTransfer.getData('text/plain')
        const { letter, value, elementId } = JSON.parse(data)
        const sourceElement = document.getElementById(elementId)
        played[id] = { letter, value }
        element.innerHTML = sourceElement.innerHTML
        sourceElement.innerHTML = ''
        occupied = true
    })

    element.addEventListener('dragstart', (e) => {
        if (!occupied) {
            return
        }

        e.dataTransfer.setData('text/plain', JSON.stringify({ letter: played[id].letter, value: played[id].value, elementId: element.id }))

    })
}