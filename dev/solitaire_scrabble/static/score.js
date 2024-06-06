export function setupScore(element, context) {



    const setScore = () => {
        element.innerHTML = `
            <div class='score'>
                <span class="">current score: ${context.score}</span>
            </div>
        `;
    }

    setScore()

}