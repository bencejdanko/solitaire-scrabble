export function setupWordScore(element,score) {
    const setWordScore = (score) => {
        element.innerHTML = `
            <div class="word-score">
                <span class="">word score: ${score}</span>
            </div>
        `;
    }
    setWordScore(score)
}