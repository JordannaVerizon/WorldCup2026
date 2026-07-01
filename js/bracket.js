function renderBracket() {
    const bracketElement = document.getElementById('bracket');
    if (!bracketElement) return;
    
    const bracketData = [
        {
            roundName: "Round of 32",
            matches: [
                { t1: "Brazil", s1: 2, t2: "Japan", s2: 1 },
                { t1: "France", s1: 3, t2: "Sweden", s2: 0 },
                { t1: "England", s1: null, t2: "DR Congo", s2: null },
                { t1: "Belgium", s1: null, t2: "Senegal", s2: null },
                { t1: "USA", s1: null, t2: "Bosnia", s2: null }
            ]
        },
        {
            roundName: "Round of 16",
            matches: [
                { t1: "Brazil", s1: null, t2: "France", s2: null },
                { t1: "TBD", s1: null, t2: "TBD", s2: null }
            ]
        }
    ];

    bracketElement.innerHTML = '';

    bracketData.forEach(round => {
        const roundColumn = document.createElement('div');
        roundColumn.className = 'bracket-round';
        
        const title = document.createElement('h3');
        title.textContent = round.roundName;
        roundColumn.appendChild(title);

        round.matches.forEach(m => {
            const matchContainer = document.createElement('div');
            matchContainer.className = 'bracket-match';
            bracketElement.style.gap = "2rem";
            
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
