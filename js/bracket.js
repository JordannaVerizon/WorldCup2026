/**
 * ==========================================================================
 * World Cup 2026 Live Bracket Processing Engine
 * ==========================================================================
 */

function renderBracket(apiMatches) {
    const bracketElement = document.getElementById('bracket');
    if (!bracketElement) return;

    // Default historical bracket states combined with incoming API records
    const rounds = {
        "Round of 32": [
            { t1: "Brazil", s1: 2, t2: "Japan", s2: 1 },
            { t1: "France", s1: 3, t2: "Sweden", s2: 0 },
            { 
                t1: "England", 
                s1: apiMatches?.find(m => m.homeTeam?.name === "England")?.score?.fullTime?.home ?? null, 
                t2: "DR Congo", 
                s2: apiMatches?.find(m => m.homeTeam?.name === "England")?.score?.fullTime?.away ?? null 
            },
            { 
                t1: "Belgium", 
                s1: apiMatches?.find(m => m.homeTeam?.name === "Belgium")?.score?.fullTime?.home ?? null, 
                t2: "Senegal", 
                s2: apiMatches?.find(m => m.homeTeam?.name === "Belgium")?.score?.fullTime?.away ?? null 
            },
            { 
                t1: "USA", 
                s1: apiMatches?.find(m => m.homeTeam?.name === "USA")?.score?.fullTime?.home ?? null, 
                t2: "Bosnia", 
                s2: apiMatches?.find(m => m.homeTeam?.name === "USA")?.score?.fullTime?.away ?? null 
            }
        ],
        "Round of 16": [
            { t1: "Brazil", s1: null, t2: "France", s2: null },
            { t1: "TBD", s1: null, t2: "TBD", s2: null }
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
            `;
            roundColumn.appendChild(matchContainer);
        });
        bracketElement.appendChild(roundColumn);
    });
}
