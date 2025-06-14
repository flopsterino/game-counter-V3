// --- SPECIAL DEBUGGING VERSION ---
alert("1. Script parsing started.");

document.addEventListener('DOMContentLoaded', () => {
    alert("2. DOMContentLoaded event fired. The page is ready.");

    // --- STATE MANAGEMENT ---
    let state = {
        games: [],
        players: [],
        scores: {},
        currentGame: null
    };
    alert("3. Initial state object created.");

    // --- DOM ELEMENTS (Only essential ones for this test) ---
    const screens = {
        setup: document.getElementById('setup-screen'),
        game: document.getElementById('game-screen')
    };
    const manageGamesBtn = document.getElementById('manage-games-btn');
    const newGameNameInput = document.getElementById('new-game-name');
    const saveNewGameBtn = document.getElementById('save-new-game-btn');
    
    alert("4. Essential DOM elements have been selected.");

    // --- A SINGLE, SIMPLE FUNCTION ---
    function showScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        if (screens[screenName]) {
            screens[screenName].classList.add('active');
        } else {
            alert(`ERROR: Screen "${screenName}" does not exist!`);
        }
    }
    alert("5. showScreen() function defined.");

    // --- A SINGLE, SIMPLE EVENT LISTENER ---
    try {
        manageGamesBtn.addEventListener('click', () => {
            alert("SUCCESS! The 'Manage Games' button click was registered.");
        });
        
        saveNewGameBtn.addEventListener('click', () => {
             const gameName = newGameNameInput.value || "Test Game";
             alert(`SUCCESS! 'Save Game' button clicked. You entered: ${gameName}`);
        });

        alert("6. Event listeners attached successfully.");
    } catch (e) {
        alert(`CRITICAL ERROR attaching event listeners: ${e.message}`);
    }

    // --- INITIALIZATION ---
    showScreen('setup');
    alert("7. App initialization complete. Buttons should now be interactive.");
});