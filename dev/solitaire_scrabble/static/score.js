export function setupScore(element,score) {

    const setScore = (score) => {
        element.innerHTML = `
            <div class="score>
                <span class="">current score: ${score}</span>
            </div>
        `;
    }

    setScore(score)

}