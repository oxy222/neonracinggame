/* -------------------------------------------------------------------------- */
/* ADDON 13: DLC TRACK EXPANSION & LIQUID GLASS TRACK SELECT MENU             */
/* -------------------------------------------------------------------------- */

(function initAddon13() {
    // 1. Define Highly Detailed DLC Tracks (Scaled for 85MPH max speed mechanics)
    const dlcTracks = [
        { 
            name: "RAINBOW ROAD", width: 950, color: '#ff00ff', 
            pts: [
                {x: -8000, y: -10000}, {x: -2000, y: -12000}, {x: 4000, y: -9000}, 
                {x: 8000, y: -4000}, {x: 4000, y: 0}, {x: 10000, y: 5000}, 
                {x: 6000, y: 11000}, {x: 0, y: 8000}, {x: -6000, y: 11000}, 
                {x: -10000, y: 5000}, {x: -5000, y: 0}, {x: -12000, y: -5000}
            ] 
        },
        { 
            name: "HUSTLE HIGHWAY", width: 1000, color: '#00ffff', 
            pts: [
                {x: -14000, y: -3000}, {x: -14000, y: -8000}, {x: 14000, y: -8000}, 
                {x: 14000, y: 8000}, {x: 8000, y: 8000}, {x: 8000, y: 0}, 
                {x: 0, y: 0}, {x: 0, y: 8000}, {x: -14000, y: 8000}
            ] 
        },
        { 
            name: "JDOT BRIDGE", width: 650, color: '#ff3333', 
            pts: [
                {x: -10000, y: -2000}, {x: -8000, y: -6000}, {x: -4000, y: -8000}, 
                {x: 0, y: -8000}, {x: 8000, y: -2000}, {x: 8000, y: 2000}, 
                {x: 0, y: 8000}, {x: -4000, y: 8000}, {x: -8000, y: 6000}, 
                {x: -10000, y: 2000}
            ] 
        },
        { 
            name: "CHOCO CANYON", width: 850, color: '#8b4513', 
            pts: [
                {x: -9000, y: -9000}, {x: -3000, y: -7000}, {x: 0, y: -10000}, 
                {x: 5000, y: -6000}, {x: 9000, y: -9000}, {x: 7000, y: -2000}, 
                {x: 11000, y: 4000}, {x: 4000, y: 6000}, {x: 0, y: 11000}, 
                {x: -4000, y: 6000}, {x: -10000, y: 2000}, {x: -6000, y: -3000}
            ] 
        },
        { 
            name: "BOUNCY BRIDGE", width: 750, color: '#ffff00', 
            pts: [
                {x: -12000, y: 0}, {x: -8000, y: -4000}, {x: -4000, y: 4000}, 
                {x: 0, y: -4000}, {x: 4000, y: 4000}, {x: 8000, y: -4000}, 
                {x: 12000, y: 0}, {x: 8000, y: 8000}, {x: 0, y: 12000}, 
                {x: -8000, y: 8000}
            ] 
        },
        { 
            name: "OIL SLICK CIRCUIT", width: 900, color: '#4a4a4a', 
            pts: [
                {x: -5000, y: -10000}, {x: 5000, y: -10000}, {x: 10000, y: -5000}, 
                {x: 5000, y: 0}, {x: 10000, y: 5000}, {x: 5000, y: 10000}, 
                {x: -5000, y: 10000}, {x: -10000, y: 5000}, {x: -5000, y: 0}, 
                {x: -10000, y: -5000}
            ] 
        }
    ];

    // Cache the original legacy tracks
    const legacyTracks = [...trackDefs]; 

    // 2. Inject Dark Mode Liquid Glass CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #screen-track-select {
            display: none; flex-direction: column; align-items: center; justify-content: center;
            width: 100%; height: 100%; pointer-events: auto; z-index: 20;
        }
        #screen-track-select.active { display: flex; }
        .liquid-panel {
            background: rgba(15, 15, 19, 0.45); 
            backdrop-filter: blur(16px); 
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08); 
            border-radius: 24px; 
            padding: 40px 60px; 
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255,255,255,0.1);
            display: flex; gap: 30px;
        }
        .track-pack-btn {
            background: rgba(0, 0, 0, 0.3); border: 2px solid #333; border-radius: 16px;
            padding: 30px; width: 350px; text-align: center; cursor: pointer;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            color: #aaa;
        }
        .track-pack-btn h3 { font-size: 2vw; margin-bottom: 10px; color: inherit; }
        .track-pack-btn p { font-weight: 700; font-size: 1rem; line-height: 1.5; }
        .track-pack-btn.selected {
            background: rgba(230, 0, 18, 0.15); border-color: var(--switch-red);
            color: #fff; transform: scale(1.05);
            box-shadow: 0 0 30px rgba(230, 0, 18, 0.3);
        }
        .track-pack-btn.selected h3 { color: var(--switch-red); text-shadow: 0 0 10px rgba(230,0,18,0.5); }
    `;
    document.head.appendChild(style);

    // 3. Inject DOM Elements
    const trackMenuHTML = `
        <div id="screen-track-select" class="screen">
            <h2>SELECT CAMPAIGN</h2>
            <div class="liquid-panel" id="track-menu-options">
                <div class="track-pack-btn selected" id="pack-legacy">
                    <h3>LEGACY</h3>
                    <p>8 Original Maps<br>Standard Circuits<br>Oval, Hyper Star</p>
                </div>
                <div class="track-pack-btn" id="pack-dlc">
                    <h3>EXPANSION</h3>
                    <p>6 DLC Maps<br>Highly Technical<br>Rainbow Road, JDot Bridge</p>
                </div>
            </div>
            <div style="margin-top: 3rem; display: flex; align-items: center; font-weight: 800; font-size: 1.5rem;" class="blink">
                PRESS <span class="btn-prompt btn-a">A</span> TO CONFIRM
            </div>
        </div>
    `;
    document.getElementById('ui-layer').insertAdjacentHTML('beforeend', trackMenuHTML);

    // 4. State Management for the New Screen
    let trackSelectIndex = 0; // 0 = Legacy, 1 = DLC

    function updateTrackMenuUI() {
        document.getElementById('pack-legacy').classList.toggle('selected', trackSelectIndex === 0);
        document.getElementById('pack-dlc').classList.toggle('selected', trackSelectIndex === 1);
    }

    // 5. Override `checkLobbyStart` to redirect to Track Select instead of Race[cite: 1]
    window.checkLobbyStart = function() {
        const active = players.filter(p => p.joined);
        if (active.length > 0 && active.every(p => p.ready)) {
            document.getElementById('lobby-start-msg').style.display = 'block';
            setTimeout(() => {
                changePhase('track_select');
            }, 1500);
        }
    };

    // 6. Hook into existing `changePhase` to handle the new screen[cite: 1]
    const originalChangePhase = window.changePhase;
    window.changePhase = function(newPhase) {
        if (newPhase === 'track_select') {
            gameState.phase = newPhase;
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById('screen-track-select').classList.add('active');
            trackSelectIndex = 0;
            updateTrackMenuUI();
        } else {
            // Remove our active class if switching elsewhere
            document.getElementById('screen-track-select')?.classList.remove('active');
            originalChangePhase(newPhase);
        }
    };

    // 7. Hook into existing `handleUIEvent` to capture inputs on the new screen[cite: 1]
    const originalHandleUIEvent = window.handleUIEvent;
    window.handleUIEvent = function(inputId, actionType) {
        if (gameState.phase === 'track_select') {
            // Only P1 (Keyboard 1 or Gamepad 1) controls the menu
            if (inputId === 0 || inputId === 2) {
                if (actionType === 'left' && trackSelectIndex === 1) {
                    trackSelectIndex = 0; playSound('blip'); updateTrackMenuUI();
                }
                if (actionType === 'right' && trackSelectIndex === 0) {
                    trackSelectIndex = 1; playSound('blip'); updateTrackMenuUI();
                }
                if (actionType === 'action') {
                    playSound('ready');
                    
                    // Mutate the global constant array to load the correct pack
                    trackDefs.length = 0; 
                    const selectedPack = trackSelectIndex === 0 ? legacyTracks : dlcTracks;
                    selectedPack.forEach(track => trackDefs.push(track));

                    // Standardize start sequence logic based on base game[cite: 1]
                    gameState.trackOrder = Array.from({length: trackDefs.length}, (_, i) => i);
                    shuffleArray(gameState.trackOrder);
                    gameState.currentTrackIdx = 0;
                    players.forEach(p => p.totalPts = 0);
                    
                    startRaceSetup();
                }
                if (actionType === 'cancel') {
                    playSound('blip');
                    changePhase('lobby'); // Go back to player ready up
                }
            }
        } else {
            originalHandleUIEvent(inputId, actionType);
        }
    };

    console.log("Addon 13: Expansion Tracks & Liquid Glass Track Select Loaded.");
})();
