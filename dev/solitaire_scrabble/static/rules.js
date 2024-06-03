export function setupRules(element) {
    const setRules = () => {
        element.innerHTML = `
            <button id='rules-button'>How to play</button>
            <div id='rules-modal'>
                <div id='modal-content' class='rules-page'>
                    <h2>Rules</h2>
                    <p>Here are the rules...</p>
                    <button id='close-modal'>Close</button>
                </div>
            </div>
        `;

        const button = document.getElementById('rules-button');
        const modal = document.getElementById('rules-modal');
        const closeModal = document.getElementById('close-modal');
        const modalContent = document.getElementById('modal-content')
        button.addEventListener('click', () => {
            modal.classList.add('show');
            setTimeout(() => modalContent.classList.add('show'), 300);
        });

        closeModal.addEventListener('click', () => {
            modalContent.classList.remove('show');
            setTimeout(() => modal.classList.remove('show'), 300);
        });


    }

    setRules()
}