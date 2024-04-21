export function setupNav(element) {
    const setNav = () => {

        element.innerHTML = `
            <nav>
                <h1>Solitaire Scrabble</h1>
                <ul class='center'>
                    <a href="/game">play</a>
                     - 
                    <a href="/rules">rules</a>
                     - 
                    <a href="https://github.com/bencejdanko/solitaire-scrabble">github</a>
                     - 

                    ${username ? `<span style="color: green; font-weight: bold;">${username}</span>
                     - 
                    <a href="/auth/logout">logout</a>
                    ` : 
                    `
                    <span style="color: green; font-weight: bold;">Guest</span>
                     - 
                    <a href="/auth/login">login</a>
                     -
                    <a href="/auth/register">register</a>
                    `}
                </ul>
            </nav>
        `;

    }

    setNav()
}