export function setupPlayedWords(element, context) {
    const setPlayedWords = () => {
        element.innerHTML = `
            <div class='played-words'>I am a block!</div>
        `
    }

    setPlayedWords()
}