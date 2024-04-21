export function setupScore(element) {

    const setScore = () => {
        element.innerHTML = `
            <div class='score'>
                <span class="">current score: ${score}</span>
            </div>
        `;
    }

    setScore()

}