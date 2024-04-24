export function setupNav(element, username) {
    const setNav = () => {

        element.innerHTML = `
            <nav>
                <ul class='center'>
                    <span class=""><i><b>Solitaire Scrabble</b></i><span>
                     - 
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