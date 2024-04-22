export function setupSequenceTile(element, letter, value, letter_score) {
    const setSequenceTile = () => {
        element.innerHTML = `
            <div class='sequence-tile'>
                ${letter}
                <span class='sequence-tile-score'>${letter_score}</span>
            </div>
        `
    }

    setSequenceTile()
}