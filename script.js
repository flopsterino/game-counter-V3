document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let state = {
        games: [],
        players: [],
        scores: {},
        currentGame: null,
        gameStartTime: null,
        gameHistory: [],
        endGamePromptShown: false,
        sessionStats: {}, // Tracks wins/losses per game for the session
        lastPlayers: [] // To remember the last set of players
    };

    // DOM ELEMENTS
    const screens = {
        setup: document.getElementById('setup-screen'),
        game: document.getElementById('game-screen'),
        history: document.getElementById('history-screen'),
        koth: document.getElementById('koth-screen')
    };
    const modals = {
        winner: document.getElementById('winner-modal'),
        manageGames: document.getElementById('manage-games-modal'),
        endOfRound: document.getElementById('end-of-round-modal')
    };
    const gameSelect = document.getElementById('game-select');
    const playerNameInputsContainer = document.getElementById('player-inputs');
    const scoreboard = document.getElementById('scoreboard');
    const historyList = document.getElementById('history-list');
    const kothResultsContent = document.getElementById('koth-results-content');

    // --- DATA PERSISTENCE ---
    function saveState() {
        try {
            localStorage.setItem('gameCounterState', JSON.stringify({
                games: state.games,
                gameHistory: state.gameHistory,
                sessionStats: state.sessionStats,
                lastPlayers: state.lastPlayers
            }));
        } catch (e) { console.error("Could not save state", e); }
    }

    function loadState() {
        try {
            const savedState = JSON.parse(localStorage.getItem('gameCounterState'));
            if (savedState) {
                state.games = savedState.games || [];
                state.gameHistory = savedState.gameHistory || [];
                state.sessionStats = savedState.sessionStats || {};
                state.lastPlayers = savedState.lastPlayers || [];
            }
        } catch (e) {
            Object.assign(state, { games: [], gameHistory: [], sessionStats: {}, lastPlayers: [] });
        }
        if (state.games.length === 0) {
            state.games.push({ name: 'Rummikub', winningScore: 100 });
            saveState();
        }
    }

    // --- UI & SCREEN LOGIC ---
    function showScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        if (screens[screenName]) screens[screenName].classList.add('active');
    }

    function showModal(modalName, show = true) {
        if (modals[modalName]) modals[modalName].classList.toggle('active', show);
    }

    function updateGameSelect() {
        gameSelect.innerHTML = state.games.map(g => `<option value="<span class="math-inline">\{g\.name\}"\></span>{g.name}</option>`).join('');
    }

    function updateManageGamesList() {
        document.getElementById('saved-games-list').innerHTML = state.games.map((game, index) => `<div><span><span class="math-inline">\{game\.name\} \(</span>{game.winningScore} points)</span><button data-index="${index}" class="delete-game-btn">X</button></div>`).join('');
    }

    function renderScoreboard() {
        const game = state.games.find(g => g.name === state.currentGame);
        if (!game) return;
        document.getElementById('game-title').textContent = state.currentGame;
        document.getElementById('winning-score-display').textContent = `First to ${game.winningScore} wins!`;
        scoreboard.innerHTML = state.players.map(player => `<div class="player-score-card" id="player-card-<span class="math-inline">\{player\.replace\(/\\s\+/g, '\-'\)\}"\><div class\="player\-header"\><span class\="player\-name"\></span>{player}</span><div class="current-score-container"><div class="current-score"><span class="math-inline">\{state\.scores\[player\]\}</div\><div class\="current\-score\-label"\>POINTS</div\></div\></div\><div class\="score\-input\-area"\><input type\="number" class\="score\-input" placeholder\="Add points\.\.\."\><button class\="add\-score\-btn primary" data\-player\="</span>{player}">Add</button></div></div>`).join('');
    }

    function renderHistory() {
        historyList.innerHTML = state.gameHistory.map(entry => `<div class="history-entry"><div class="history-summary"><h3>${entry.game}</h3><p>Winner: <span class="math-inline">\{entry\.winner \|\| 'Incomplete'\} \(</span>{new Date(entry.startTime).toLocaleDateString()})</p><p>Duration: ${entry.duration}</p></div></div>`).join('');
    }
    
    function populateLastPlayers() {
        if (state.lastPlayers && state.lastPlayers.length > 0) {
            playerNameInputsContainer.innerHTML = ''; // Clear default inputs
            state.lastPlayers.forEach(name => {
                const input = document.createElement('input');
                input.type = '