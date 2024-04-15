export function setupBoardTile(element, value, id) {

    const setTile = (value) => {

        let inner = ''
        let style = ''
        if (value !== null) {
            inner = value
            style = 'background-color: #3afd47be'
        }

        element.innerHTML = `
            <div class="board-tile" style='${style}'>
                <span class="tile-value"'>${inner}</span>
            </div>
        `;
    }

    setTile(value)

    element.addEventListener('ondragover', (e) => {
        
    })

    element.addEventListener('ondrop', (e) => {
        e.preventDefault();
        console.log(id)
    })
}