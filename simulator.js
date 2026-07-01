/**
 * ==========================================================================
 * World Cup 2026 Poisson Simulation & Route Predictor Engine
 * ==========================================================================
 */

// 1. Structural Bracket Map defining potential opponent pathways
const BRACKET_TREE = {
    "usa": ["Belgium", "Argentina", "Germany", "Brazil"],
    "brazil": ["Norway", "Belgium", "Argentina", "Germany"],
    "germany": ["Croatia", "Argentina", "Brazil", "Belgium"],
    "argentina": ["Denmark", "Germany", "Brazil", "Belgium"],
    "belgium": ["USA", "Brazil", "Argentina", "Germany"]
};

// 2. Performance Coefficients (Attack / Defense strengths based on recent matches)
// Higher attack = more goals scored. Higher defense = fewer goals conceded.
const TEAM_STRENGTHS = {
    "USA": { attack: 1.4, defense: 1.2 },
    "Belgium": { attack: 1.8, defense: 1.0 },
    "Brazil": { attack: 2.3, defense: 0.7 },
    "Norway": { attack: 1.5, defense: 1.4 },
    "Germany": { attack: 2.0, defense: 1.1 },
    "Croatia": { attack: 1.6, defense: 1.0 },
    "Argentina": { attack: 2.1, defense: 0.8 },
    "Denmark": { attack: 1.3, defense: 1.2 }
};

/**
 * Initializes listeners on the UI input components
 */
function setupSimulator() {
    const btn = document.getElementById('simulate-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const inputTeam = document.getElementById('team-input').value.trim();
        analyzeTeamPath(inputTeam);
    });
}

/**
 * Main calculation loop handling opponent mapping and probability matrix creation
 */
function analyzeTeamPath(teamName) {
    const resultsDiv = document.getElementById('simulator-results');
    const opponentList = document.getElementById('opponent-list');
    const rows = document.getElementById('probability-rows');
    
    if (!resultsDiv || !opponentList || !rows) return;

    opponentList.innerHTML = '';
    rows.innerHTML = '';

    const normalizedInput = teamName.toLowerCase();
    const treeKey = Object.keys(BRACKET_TREE).find(k => k === normalizedInput);
    const properTeamName = Object.keys(TEAM_STRENGTHS).find(t => t.toLowerCase() === normalizedInput);

    if (!treeKey || !properTeamName) {
        alert("Team not found in this stage or eliminated! Try entering: USA, Brazil, Germany, or Argentina.");
        return;
    }

    // Reveal hidden results section container
    resultsDiv.classList.remove('hidden');

    // 1. Display Potential Opponent Path sequence
    const possibleOpponents = BRACKET_TREE[treeKey];
    possibleOpponents.slice(0, 3).forEach((opponent, index) => {
        let li = document.createElement('li');
        let roundLabel = index === 0 ? "Next Match" : index === 1 ? "Potential Semis" : "Potential Final";
        li.innerHTML = `<span style="color: var(--text-secondary); font-size: 0.8rem;">${roundLabel}:</span> <strong>${opponent}</strong>`;
        opponentList.appendChild(li);
    });

    // 2. Generate Scoreline Matrices using client-side Poisson Formula
    const immediateOpponent = possibleOpponents[0];
    const opponentData = TEAM_STRENGTHS[immediateOpponent];
    const selectedTeamData = TEAM_STRENGTHS[properTeamName];

    // Expected goals = Team Attack Strength * Opponent Defense Strength
    const homeExpectedGoals = selectedTeamData.attack * opponentData.defense;
    const awayExpectedGoals = opponentData.attack * selectedTeamData.defense;

    let scoreMatrix = [];

    // Evaluate all combinations from 0-0 to 3-3
    for (let h = 0; h <= 3; h++) {
        for (let a = 0; a <= 3; a++) {
            let homeProb = poissonDistribution(h, homeExpectedGoals);
            let awayProb = poissonDistribution(a, awayExpectedGoals);
            let combinedProb = (homeProb * awayProb * 100).toFixed(1);

            scoreMatrix.push({
                scoreString: `${properTeamName} ${h} - ${a} ${immediateOpponent}`,
                percentage: parseFloat(combinedProb)
            });
        }
    }

    // Sort the results so the most likely scoreline surfaces to the top
    scoreMatrix.sort((x, y) => y.percentage - x.percentage);

    // Render the top 5 highest-probability score configurations into our stylesheet layout
    scoreMatrix.slice(0, 5).forEach(item => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.scoreString}</td>
            <td><span style="color: var(--accent-neon-green); font-weight:600;">${item.percentage}%</span></td>
        `;
        rows.appendChild(tr);
    });
}

/**
 * Mathematical Factorial Calculation Helper
 */
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

/**
 * Computes individual parameter probability using pure Poisson distribution formula:
 * P(k; λ) = (λ^k * e^-λ) / k!
 */
function poissonDistribution(k, lambda) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}