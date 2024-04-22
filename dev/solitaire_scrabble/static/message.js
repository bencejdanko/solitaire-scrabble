export function setupMessage(element, buffer) {
    const setMessage = () => {

        let style = 'color: black';
        if (buffer.status == 2) {
            style = 'color: green';
        } else if (buffer.status == 4) {
            style = 'color: red';
        }

        element.innerHTML = `
            <span style="${style}">${buffer.message}</span>
        `;
    }

    setMessage()
}