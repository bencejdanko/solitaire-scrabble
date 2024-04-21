export function setupSequenceTile(element, letter, value) {
    const setSequenceTile = () => {
        element.innerHTML = `
            <div class='sequence-tile'>
                ${letter}
                <span class='sequence-tile-score'>${value}</span>
            </div>
        `
    }

    setSequenceTile()
}