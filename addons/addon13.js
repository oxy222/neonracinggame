// addons/addon13.js - Map Expansion Pack & Selection Screen
// Adds 5 gorgeous new DLC maps and a AAA Map Selection UI after the lobby.
// Features real-time rainbow color-shifting for Rainbow Road.

const injectMapSelectUI = () => {
    const style = document.createElement('style');
    style.id = 'dlc-map-styles';
    style.innerHTML = `
        #screen-map-select {
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .cup-container {
            display: flex;
            gap: 4vw;
            margin-top: 4vh;
            width: 80%;
            max-width: 1200px;
            justify-content: center;
        }
        
        .cup-card {
            flex: 1;
            height: 45vh;
            min-height: 300px;
            background: linear-gradient(180deg, #222 0%, #111 100%);
            border: 6px solid #444;
            border-radius: 20px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        }
        
        .cup-card.selected {
            border-color: var(--switch-cyan, #00ffff);
            transform: scale(1.05) translateY(-10px);
            box-shadow: 0 20px 50px rgba(0,255,255,0.3), inset 0 0 30px rgba(0,255,255,0.1);
        }
        
        .cup-title {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            font-style: italic;
            font-size: 3rem;
            color: #fff;
            text-align: center;
            margin-bottom: 10px;
            text-shadow: 2px 2px 0 #000;
        }
        
        .cup-card.selected .cup-title {
            color: var(--switch-cyan, #00ffff);
            text-shadow: 0 0 15px rgba(0,255,255,0.8);
        }
        
        .cup-tracks {
            margin-top: 20px;
            font-family: 'Press Start 2P', monospace;
            font-size: 1rem;
            color: #aaa;
            line-height: 2.2;
            text-align: center;
        }
        
        .dlc-badge {
            position: absolute;
            top: -20px;
            right: -30px;
            background: #e60012;
            color: #fff;
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            padding: 30px 40px 10px 40px;
            transform: rotate(45deg);
            font-size: 1.2rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        }
    `;
    document.head.appendChild(style);

    const mapScreen = document.createElement('div');
    mapScreen.id = 'screen-map-select';
    mapScreen.className = 'screen';
    mapScreen.innerHTML = `
        <h2>CHOOSE YOUR GRAND PRIX</h2>
        <div class="cup-container">
            <div class="cup-card selected" id="cup-0">
                <div class="cup-title">LEGACY CUP</div>
                <div style="color: #666; font-weight: 800;">ORIGINAL NEON GP CIRCUITS</div>
                <div class="cup-tracks">
                    NEON OVAL<br>
                    CYBER BEAN<br>
                    HYPER STAR<br>
                    DESERT SERPENT<br>
                    THE OCTAGON<br>
                    CIRCUIT LOOP<br>
                    MIDNIGHT RUN<br>
                    THE COLOSSEUM
                </div>
            </div>
            
            <div class="cup-card" id="cup-1">
                <div class="dlc-badge">NEW!</div>
                <div class="cup-title" style="color: #ff00ff;">DLC CUP</div>
                <div style="color: #888; font-weight: 800;">EXPANSION PACK TRACKS</div>
                <div class="cup-tracks" style="color: #eee;">
                    RAINBOW ROAD<br>
                    OIL SLICK HIGHWAY<br>
                    CHOCO CANYON<br>
                    JDOT CIRCUIT<br>
                    HUSTLE BRIDGE
                </div>
            </div>
        </div>
        <div style="margin-top: 3rem; display: flex; align-items: center; font-weight: 800; font-size: 1.5rem;" class="blink">
            P1: PRESS <span class="btn-prompt btn-a">A</span> TO CONFIRM
        </div>
    `;
    document.getElementById('ui-layer').appendChild(mapScreen);
};

const injectDLC = () => {
    // Ensure base trackDefs exists before pushing
    if (typeof trackDefs === 'undefined') return setTimeout(injectDLC, 100);

    const dlcTracks = [
        { 
            name: "RAINBOW ROAD", width: 1200, color: '#ff00ff', useImage: false, 
            pts: [
                {x: -10000, y: -8000}, {x: 0, y: -4000}, {x: 10000, y: -8000}, 
                {x: 12000, y: 0}, {x: 10000, y: 8000}, {x: 0, y: 4000}, 
                {x: -10000, y: 8000}, {x: -12000, y: 0}
            ] // Massive spiral layout
        },
        { 
            name: "OIL SLICK HIGHWAY", width: 850, color: '#00ff44', useImage: false, 
            pts: [
                {x: -14000, y: -3000}, {x: 0, y: -4000}, {x: 14000, y: -3000}, 
                {x: 14000, y: 3000}, {x: 0, y: 4000}, {x: -14000, y: 3000}
            ] // Very long, tight bowing straights
        },
        { 
            name: "CHOCO CANYON", width: 900, color: '#d2691e', useImage: false, 
            pts: [
                {x: -7000, y: -7000}, {x: -2000, y: -9000}, {x: 2000, y: -4000}, 
                {x: 7000, y: -9000}, {x: 9000, y: 0}, {x: 7000, y: 9000}, 
                {x: 2000, y: 4000}, {x: -2000, y: 9000}, {x: -7000, y: 7000}, {x: -9000, y: 0}
            ] // Serrated canyon zigzag
        },
        { 
            name: "JDOT CIRCUIT", width: 1000, color: '#00ccff', useImage: false, 
            pts: [
                {x: -6000, y: -6000}, {x: 0, y: -6000}, {x: 6000, y: -6000}, 
                {x: 6000, y: 0}, {x: 9000, y: 0}, {x: 9000, y: 6000}, 
                {x: -6000, y: 6000}, {x: -6000, y: 0}, {x: -9000, y: 0}, {x: -9000, y: -6000}
            ] // Techy, block-style 90 degree sweepers
        },
        { 
            name: "HUSTLE BRIDGE", width: 800, color: '#ff3300', useImage: false, 
            pts: [
                {x: -9000, y: -7000}, {x: 0, y: -9000}, {x: 9000, y: -7000}, 
                {x: 0, y: 0}, {x: -9000, y: 7000}, {x: 0, y: 9000}, 
                {x: 9000, y: 7000}, {x: 0, y: 0}
            ] // Enormous figure-8 crossing layout
        }
    ];

    // Push the 5 new tracks onto the global registry (indices 8 through 12)
    trackDefs.push(...dlcTracks);
};

setTimeout(() => {
    injectMapSelectUI();
    injectDLC();

    // 1. Hook changePhase to recognize the new 'map_select' screen
    if (typeof changePhase === 'function') {
        const originalChangePhase = changePhase;
        window.changePhase = function(newPhase) {
            originalChangePhase(newPhase);
            if (newPhase === 'map_select') {
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                document.getElementById('screen-map-select').classList.add('active');
                window.gameState.mapSelection = 0; // Default to Legacy
                updateMapSelectGraphics();
            }
        };
    }

    // 2. Intercept checkLobbyStart to redirect to Map Selection instead of Racing
    if (typeof checkLobbyStart === 'function') {
        window.checkLobbyStart = function() {
            const active = players.filter(p => p.joined);
            if (active.length > 0 && active.every(p => p.ready)) {
                document.getElementById('lobby-start-msg').style.display = 'block';
                setTimeout(() => {
                    // Bypass standard trackOrder generation and jump to our new UI
                    changePhase('map_select');
                }, 1500);
            }
        };
    }

    if (typeof handleUIEvent === 'function') {
        const originalHandleUI = handleUIEvent;
        window.handleUIEvent = function(inputId, actionType) {
            
            if (typeof gameState !== 'undefined' && gameState.phase === 'map_select') {
                // Allow only Player 1 (Keyboard 1 or Gamepad 1) to pick the maps
                if (inputId === 0 || inputId === 2) {
                    if (actionType === 'left' || actionType === 'right') {
                        gameState.mapSelection = 1 - gameState.mapSelection; // Toggles 0 and 1
                        updateMapSelectGraphics();
                        if(typeof playSound === 'function') playSound('blip');
                    } 
                    else if (actionType === 'action') {
                        if(typeof playSound === 'function') playSound('ready');
                        
                        // Assign proper indices based on selection
                        if (gameState.mapSelection === 0) {
                            // Legacy Cup (Indices 0 through 7)
                            gameState.trackOrder = [0, 1, 2, 3, 4, 5, 6, 7];
                        } else {
                            // DLC Cup (Indices 8 through 12)
                            gameState.trackOrder = [8, 9, 10, 11, 12];
                        }
                        
                        // Shuffle the chosen cup
                        if (typeof shuffleArray === 'function') shuffleArray(gameState.trackOrder);
                        
                        // Boot into the race
                        gameState.currentTrackIdx = 0;
                        players.forEach(p => p.totalPts = 0);
                        if (typeof startRaceSetup === 'function') startRaceSetup();
                    }
                }
                return; // Consume the input
            }
            
            // Pass all other inputs to the base game logic
            originalHandleUI(inputId, actionType);
        };
    }

    // Update the Addon 6 Footer prompts if it exists
    if (typeof updateFooterPrompts === 'function') {
        const origFooter = updateFooterPrompts;
        window.updateFooterPrompts = function(phase) {
            origFooter(phase);
            if (phase === 'map_select') {
                const footer = document.getElementById('nx-footer');
                if (footer) {
                    footer.innerHTML = `
                        <div class="nx-prompt-item"><span class="btn-prompt btn-a">A</span> <span>CONFIRM CUP</span></div>
                        <div class="nx-prompt-item"><span class="btn-prompt pill">◄ ►</span> <span>SELECT</span></div>
                    `;
                }
            }
        };
    }

    // Intercept the draw loop to make Rainbow Road physically pulse colors!
    if (typeof drawTrack === 'function') {
        const originalDrawTrack = drawTrack;
        window.drawTrack = function() {
            if (currentTrack && currentTrack.name === "RAINBOW ROAD") {
                // Calculate shifting HSL color based on system time
                const hue = (Date.now() * 0.15) % 360;
                currentTrack.color = `hsl(${hue}, 100%, 60%)`;
            }
            originalDrawTrack();
        };
    }

}, 2000); // 2000ms ensures it evaluates after all prior Addons and Base definitions

function updateMapSelectGraphics() {
    const cup0 = document.getElementById('cup-0');
    const cup1 = document.getElementById('cup-1');
    
    if (cup0 && cup1) {
        if (window.gameState.mapSelection === 0) {
            cup0.classList.add('selected');
            cup1.classList.remove('selected');
        } else {
            cup1.classList.add('selected');
            cup0.classList.remove('selected');
            // Give DLC card a special dynamic color when selected
            cup1.style.borderColor = '#ff00ff';
        }
    }
}
