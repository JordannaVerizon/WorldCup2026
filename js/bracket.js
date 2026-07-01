/**
 * ==========================================================================
 * World Cup 2026 Live Bracket Processing Engine (With Schedules)
 * ==========================================================================
 */

function renderBracket(apiMatches) {
    const bracketElement = document.getElementById('bracket');
    if (!bracketElement) return;

    const getMatchData = (teamName) => {
        const found = apiMatches?.find(m => m.homeTeam === teamName);
        return found ? found : null;
    };

    const engMatch = getMatchData("England");
    const belMatch = getMatchData("Belgium");
    const usaMatch = getMatchData("USA");

    const rounds = {
        "Round of 32": [
            { t1: "Brazil", s1: 2, t2: "Japan", s2: 1, meta: "June 29 • Final" },
            { t1: "France", s1: 3, t2: "Sweden", s2: 0, meta: "June 30 • Final" },
            { 
                t1: "England", s1: engMatch && engMatch.status !== 'UPCOMING' ? engMatch.homeScore : 0, 
                t2: "DR Congo", s2: engMatch && engMatch.status !== 'UPCOMING' ? engMatch.awayScore : 0, 
                meta: engMatch ? engMatch.timeDisplay : "July 1 • 12:00 PM" 
            },
            { 
                t1: "Belgium", s1: belMatch && belMatch.status !== 'UPCOMING' ? belMatch.homeScore : 0, 
                t2: "Senegal", s2: belMatch && belMatch.status !== 'UPCOMING' ? belMatch.awayScore : 0, 
                meta: belMatch ? belMatch.timeDisplay : "July 1 • 4:00 PM" 
            },
            { 
                t1: "USA", s1: usaMatch && usaMatch.status !== 'UPCOMING' ? usaMatch.homeScore : 0, 
                t2: "Bosnia", s2: usaMatch && usaMatch.status !== 'UPCOMING' ? usaMatch.awayScore : 0, 
                meta: usaMatch ? usaMatch.timeDisplay : "July 1 • 8:00 PM" 
            }
        ],
        "Round of 16": [
            { t1: "Brazil", s1: null, t2: "France", s2: null, meta: "July 4 • 2:00 PM" },
            { t1: "TBD", s1: null, t2: "TBD", s2: null, meta: "July 5 • 6:00 PM" }
        ]
    };

    bracketElement.innerHTML = '';

    Object.keys(rounds).forEach(roundName => {
        const roundColumn = document.createElement('div');
        roundColumn.className = 'bracket-round';
        
        const title = document.createElement('h3');
        title.textContent = roundName;
        roundColumn.appendChild(title);

        rounds[roundName].forEach(m => {
            const matchContainer = document.createElement('div');
            matchContainer.className = 'bracket-match';
            
            matchContainer.innerHTML = `
                <div class="teams-display">
                    <div class="team-row">
                        <span>${m.t1}</span>
                        <span>${m.s1 ?? '-'}</span>
                    </div>
                    <div class="team-row">
                        <span>${m.t2}</span>
                        <span>${m.s2 ?? '-'}</span>
                    </div>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); border-top: 1px solid var(--border-glass); margin-top: 0.5rem; padding-top: 0.4rem; text-align: center; font-weight: 500;">
                    ${m.meta}
                </div>
            `;
            roundColumn.appendChild(matchContainer);
        });
        bracketElement.appendChild(roundColumn);
    });
}
