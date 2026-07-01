/**
 * ==========================================================================
 * World Cup 2026 Bracket Visualization Engine
 * ==========================================================================
 */

function renderBracket() {
    const bracketElement = document.getElementById('bracket');
    if (!bracketElement) return;
    
    // Structured representation of the World Cup Knockout Phase
    const bracketData = [
        {
            roundName: "Round of 16",
            matches: [
                { t1: "Germany", s1: 3, t2: "Croatia", s2: 1 },
                { t1: "Argentina", s1: 2, t2: "Denmark", s2: 0 },
                { t1: "USA", s1: 1, t2: "Belgium", s2: 2 },
                { t1: "Brazil", s1: 4, t2: "Norway", s2: 1 }
            ]
        },
        {
            roundName: "Quarter-Finals",
            matches: [
                { t1: "Germany", s1: 1, t2: "Argentina", s2: 2 },
                { t1: "Belgium", s1: 0, t2: "Brazil", s2: 3 }
            ]
        },
        {
            roundName: "Semi-Finals",
            matches: [
                { t1: "Argentina", s1: null, t2: "Brazil", s2: null }
            ]
        },
        {
            roundName: "Final",
            matches: [
                { t1: "TBD", s1: null, t2: "TBD", s2: null }
            ]
        }
    ];

    // Clear any existing hardcoded template structures
    bracketElement.innerHTML = '';

    // Loop through each round to generate vertical columns
    bracketData.forEach(round => {
        const roundColumn = document.createElement('div');
        roundColumn.className = 'bracket-round';
        
        // Append the Round Header Label
        const title = document.createElement('h3');
        title.textContent = round.roundName;
        roundColumn.appendChild(title);

        // Populate matches within this specific round column
        round.matches.forEach(m => {
            const matchContainer = document.createElement('div');
            matchContainer.className = 'bracket-match';
            
            // Determine text colors based on who won/progressed
            const t1Won = m.s1 !== null && m.s2 !== null && m.s1 > m.s2;
            const t2Won = m.s1 !== null && m.s2 !== null && m.s2 > m.s1;
            
            matchContainer.innerHTML = `
                <div class="teams-display">
                    <div class="team-row" style="opacity: ${m.s1 === null && m.t1 !== 'TBD' ? '1' : (t1Won || m.s1 === null ? '1' : '0.4')}">
                        <span style="${t1Won ? 'color: var(--accent-neon-green); font-weight: 600;' : ''}">${m.t1}</span>
                        <span>${m.s1 ?? '-'}</span>
                    </div>
                    <div class="team-row" style="opacity: ${m.s2 === null && m.t2 !== 'TBD' ? '1' : (t2Won || m.s2 === null ? '1' : '0.4')}">
                        <span style="${t2Won ? 'color: var(--accent-neon-green); font-weight: 600;' : ''}">${m.t2}</span>
                        <span>${m.s2 ?? '-'}</span>
                    </div>
                </div>
            `;
            roundColumn.appendChild(matchContainer);
        });

        // Inject the completed round column directly into the DOM tree canvas
        bracketElement.appendChild(roundColumn);
    });
}
