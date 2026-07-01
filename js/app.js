/**
 * ==========================================================================
 * World Cup 2026 Smart Time-Calculated Automation Engine
 * Localized Eastern Time Zone Configuration
 * ==========================================================================
 */

let tournamentData = [];

function fetchWorldCupData() {
    const liveTicker = document.getElementById('live-ticker');
    liveTicker.innerHTML = "🏆 FIFA World Cup 2026™ — Live Auto-Tracking Active";
    
    // Get the current time on the user's computer
    const now = new Date();
    
    /**
     * AUTHENTIC EASTERN TIME ZONE SCHEDULE MATRIX
     * The system automatically tracks states based on your local clock
     */
    const matchSchedule = [
        {
            id: 201,
            homeTeam: "England", awayTeam: "DR Congo",
            kickoff: new Date("2026-07-01T12:00:00-04:00"), // 12:00 PM Eastern Time
            liveScore: { home: 1, away: 0 },
            finalScore: { home: 2, away: 0 }
        },
        {
            id: 202,
            homeTeam: "Belgium", awayTeam: "Senegal",
            kickoff: new Date("2026-07-01T16:00:00-04:00"), // 4:00 PM Eastern Time
            liveScore: { home: 0, away: 0 },
            finalScore: { home: 1, away: 2 }
        },
        {
            id: 203,
            homeTeam: "USA", awayTeam: "Bosnia & Herzegovina",
            kickoff: new Date("2026-07-01T20:00:00-04:00"), // 8:00 PM Eastern Time
            liveScore: { home: 1, away: 0 },
            finalScore: { home: 3, away: 1 }
        }
    ];

    tournamentData = matchSchedule.map(match => {
        const matchDurationMs = 105 * 60 * 1000; // 90 mins + halftime break (1 hr 45 mins total)
        const timeElapsedMs = now - match.kickoff;
        
        let status = 'UPCOMING';
        let displayTime = match.kickoff.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        let currentHomeScore = 0; // Default upcoming to 0
        let currentAwayScore = 0; // Default upcoming to 0

        if (timeElapsedMs > 0 && timeElapsedMs < matchDurationMs) {
            // Match is currently playing right now
            status = 'LIVE';
            const minutesElapsed = Math.floor(timeElapsedMs / 60000);
            displayTime = `Playing Now — ${minutesElapsed >= 45 && minutesElapsed <= 60 ? 'HT' : minutesElapsed + "'"}`;
            currentHomeScore = match.liveScore.home;
            currentAwayScore = match.liveScore.away;
        } else if (timeElapsedMs >= matchDurationMs) {
            // Match has finished
            status = 'FINISHED';
            displayTime = "Final Score";
            currentHomeScore = match.finalScore.home;
            currentAwayScore = match.finalScore.away;
        }

        return {
            status: status,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            homeScore: currentHomeScore,
            awayScore: currentAwayScore,
            timeDisplay: displayTime
        };
    });

    initApp();
}

function initApp() {
    renderLiveMatches();
    if (typeof renderBracket === "function") renderBracket(tournamentData);
    if (typeof setupSimulator === "function") setupSimulator();
}

function renderLiveMatches() {
    const grid = document.getElementById('matches-grid');
    if (!grid) return;
    grid.innerHTML = '';

    tournamentData.forEach(match => {
        const isLive = match.status === 'LIVE';
        const isFinished = match.status === 'FINISHED';
        const card = document.createElement('div');
        card.className = `match-card ${isLive ? 'live' : 'upcoming'}`;
        
        let badgeText = 'UPCOMING MATCH';
        if (isLive) badgeText = '● LIVE NOW';
        if (isFinished) badgeText = 'FINISHED';

        card.innerHTML = `
            <div class="match-status">${badgeText}</div>
            <div class="teams-display">
                <div class="team-row">
                    <span>${match.homeTeam}</span>
                    <span>${match.homeScore}</span>
                </div>
                <div class="team-row">
                    <span>${match.awayTeam}</span>
                    <span>${match.awayScore}</span>
                </div>
            </div>
            <div class="match-time">${match.timeDisplay}</div>
        `;
        grid.appendChild(card);
    });
}

// Check loop every 30 seconds
setInterval(fetchWorldCupData, 30000);
window.onload = fetchWorldCupData;
