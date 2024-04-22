export function setupScore(element, score = 0) {

    const setScore = () => {
        element.innerHTML = `
            <div class='score'>
                <span class="">current score: ${score}</span>
            </div>
        `;
    }

    setScore()

}