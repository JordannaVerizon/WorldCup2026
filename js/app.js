/**
 * ==========================================================================
 * World Cup 2026 Live API Connection Engine
 * ==========================================================================
 */

// Configuration Options
const API_URL = "https://v3.football.api-sports.io/fixtures?league=1&season=2026";
const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your free API-Football or mockup key

// Global variable to cache current match states
let tournamentData = [];

/**
 * Asynchronously fetches live data from the sports data provider
 */
async function fetchWorldCupData() {
    const liveTicker = document.getElementById('live-ticker');
    
    try {
        // If you don't have an API key yet, this will catch and use the fallback mock data below
        if (API_KEY === "YOUR_API_KEY_HERE") {
            throw new Error("API Key not configured. Using high-fidelity local simulation mode.");
        }

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": API_KEY
            }
        });

        if (!response.ok) throw new Error("Network response was not stable");
        
        const data = await response.json();
        tournamentData = data.response;
        
        liveTicker.innerHTML = "⚡ Live Feed Connected (Sync Active)";
        initApp();

    } catch (error) {
        console.warn(error.message);
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
 * Iterates through match structures and renders clean HTML UI components
 */
function renderLiveMatches() {
    const grid = document.getElementById('matches-grid');
    if (!grid) return;
    grid.innerHTML = '';

    tournamentData.forEach(match => {
        const status = match.fixture.status.short;
        
        // Filter out finished games, only grab Live or Scheduled matches
        if (['1H', '2H', 'ET', 'P', 'LIVE', 'NS'].includes(status)) {
            const isLive = status !== 'NS';
            const card = document.createElement('div');
            card.className = `match-card ${isLive ? 'live' : 'upcoming'}`;
            
            // Format match timing display cleanly
            let timeDisplay = !isLive 
                ? new Date(match.fixture.date).toLocaleDateString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}) 
                : `Minute: ${match.fixture.status.elapsed}'`;
            
            card.innerHTML = `
                <div class="match-status">${isLive ? '● LIVE NOW' : 'UPCOMING MATCH'}</div>
                <div class="teams-display">
                    <div class="team-row">
                        <span>${match.teams.home.name}</span>
                        <span>${match.goals.home ?? 0}</span>
                    </div>
                    <div class="team-row">
                        <span>${match.teams.away.name}</span>
                        <span>${match.goals.away ?? 0}</span>
                    </div>
                </div>
                <div class="match-time">${timeDisplay}</div>
            `;
            grid.appendChild(card);
        }
    });
}

/**
 * Fail-safe Mock Generator to populate the modern look instantly
 * without needing paid premium endpoints during local development
 */
function loadMockLiveMatches() {
    tournamentData = [
        {
            fixture: { id: 101, status: { short: '1H', elapsed: 34 }, date: "2026-07-01T15:00:00Z" },
            teams: { home: { name: "USA" }, away: { name: "Belgium" } },
            goals: { home: 2, away: 1 }
        },
        {
            fixture: { id: 102, status: { short: 'NS', elapsed: 0 }, date: "2026-07-02T20:00:00Z" },
            teams: { home: { name: "Argentina" }, away: { name: "Denmark" } },
            goals: { home: null, away: null }
        },
        {
            fixture: { id: 103, status: { short: 'NS', elapsed: 0 }, date: "2026-07-03T18:00:00Z" },
            teams: { home: { name: "Germany" }, away: { name: "Croatia" } },
            goals: { home: null, away: null }
        }
    ];
    initApp();
}

// Check for live score updates every 60 seconds
setInterval(() => {
    fetchWorldCupData();
}, 60000);

// Initialize when browser loads file elements
window.onload = fetchWorldCupData;
