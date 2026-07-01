/**
 * ==========================================================================
 * World Cup 2026 Live API Connection Engine (Football-Data.org Edition)
 * ==========================================================================
 */

// Configuration Options - WC is League Code 'WC' in Football-Data.org
const API_URL = "https://api.football-data.org/v4/competitions/WC/matches";
const API_KEY = "5b7a7ac5a9eb460699b28b314dce5968"; 

let tournamentData = [];

/**
 * Asynchronously fetches live data from Football-Data.org
 */
async function fetchWorldCupData() {
    const liveTicker = document.getElementById('live-ticker');
    
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "X-Auth-Token": API_KEY
            }
        });

        if (!response.ok) throw new Error("API Limit reached or invalid configuration");
        
        const data = await response.json();
        tournamentData = data.matches;
        
        liveTicker.innerHTML = "⚡ Live Feed Connected (Sync Active)";
        initApp();

    } catch (error) {
        console.warn("API Error, falling back to local simulation engine:", error.message);
        liveTicker.innerHTML = "🔮 Simulation Engine Active (Local Mode)";
        loadMockLiveMatches();
    }
}

/**
 * Triggers the rendering engines across modules once data is ready
 */
function initApp() {
    renderLiveMatches();
    if (typeof renderBracket === "function") renderBracket();
    if (typeof setupSimulator === "function") setupSimulator();
}

/**
 * Renders data dynamically based on the Football-Data.org JSON schema
 */
function renderLiveMatches() {
    const grid = document.getElementById('matches-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Filter for active or upcoming fixtures
    const visibleMatches = tournamentData.filter(m => ['TIMED', 'IN_PLAY', 'PAUSED'].includes(m.status));

    if (visibleMatches.length === 0) {
        grid.innerHTML = `<div style="color: var(--text-secondary); grid-column: 1/-1;">No live matches right now. Check back at match time!</div>`;
        return;
    }

    visibleMatches.forEach(match => {
        const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
        const card = document.createElement('div');
        card.className = `match-card ${isLive ? 'live' : 'upcoming'}`;
        
        let timeDisplay = !isLive 
            ? new Date(match.utcDate).toLocaleDateString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}) 
            : "Match in Progress";
        
        card.innerHTML = `
            <div class="match-status">${isLive ? '● LIVE NOW' : 'UPCOMING MATCH'}</div>
            <div class="teams-display">
                <div class="team-row">
                    <span>${match.homeTeam.name || 'TBD'}</span>
                    <span>${match.score.fullTime.home ?? 0}</span>
                </div>
                <div class="team-row">
                    <span>${match.awayTeam.name || 'TBD'}</span>
                    <span>${match.score.fullTime.away ?? 0}</span>
                </div>
            </div>
            <div class="match-time">${timeDisplay}</div>
        `;
        grid.appendChild(card);
    });
}

/**
 * Backup fallback simulation data
 */
function loadMockLiveMatches() {
    // If the API server is down or free tier limit is hit, this keeps the UI beautiful
    tournamentData = [
        {
            status: 'IN_PLAY',
            utcDate: "2026-07-01T15:00:00Z",
            homeTeam: { name: "USA" }, awayTeam: { name: "Belgium" },
            score: { fullTime: { home: 2, away: 1 } }
        }
    ];
    initApp();
}

// Auto-check updates every 60 seconds
setInterval(fetchWorldCupData, 60000);

window.onload = fetchWorldCupData;
