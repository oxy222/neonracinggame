// addons/addon13.js - Map Expansion Pack & AAA Selection Screen
// Adds 5 massive, Mario Kart-inspired DLC maps and a gorgeous Map Selection UI.
// Completely intercepts the lobby auto-start sequence to guarantee track selection.

const injectDLC = () => {
    if (typeof trackDefs === 'undefined') return setTimeout(injectDLC, 100);

    const dlcTracks = [
        { 
            name: "RAINBOW ROAD", width: 1200, color: '#ff00ff', useImage: false, 
            pts: [
                {x: 0, y: -12000}, {x: 4000, y: -4000}, {x: 12000, y: -4000}, 
                {x: 6000, y: 2000}, {x: 8000, y: 10000}, {x: 0, y: 6000}, 
                {x: -8000, y: 10000}, {x: -6000, y: 2000}, {x: -12000, y: -4000}, 
                {x: -4000, y: -4000}
            ] // Massive Star Layout
        },
        { 
            name: "BOWSER'S CITADEL", width: 1000, color: '#ff3300', useImage: false, 
            pts: [
                {x:-8000, y:-8000}, {x:8000, y:-8000}, {x:8000, y:-2000}, 
                {x:2000, y:-2000}, {x:2000, y:2000}, {x:8000, y:2000}, 
                {x:8000, y:8000}, {x:-8000, y:8000}, {x:-8000, y:2000}, 
                {x:-2000, y:2000}, {x:-2000, y:-2000}, {x:-8000, y:-2000}
            ] // Intimidating squared orthogonal paths
        },
        { 
            name: "MOO MOO HIGHWAY", width: 1100, color: '#32cd32', useImage: false, 
            pts: [
                {x: -10000, y: 0}, {x: -6000, y: -8000}, {x: 0, y: -4000}, 
                {x: 6000, y: -8000}, {x: 10000, y: 0}, {x: 6000, y: 8000}, 
                {x: 0, y: 4000}, {x: -6000, y: 8000}
            ] // Smooth, sweeping country curves
        },
        { 
            name: "TOAD'S TURNPIKE", width: 1000, color: '#ffaa00', useImage: false, 
            pts: [
                {x:-8000, y:-6000}, {x:0, y:-8000}, {x:8000, y:-6000}, 
                {x:0, y:0}, {x:-8000, y:6000}, {x:0, y:8000}, 
                {x:8000, y:6000}, {x:0, y:0}
            ] // Enormous Figure-8 crossover layout
        },
        { 
            name: "YOSHI'S ISLAND", width: 1000, color: '#00c3e3', useImage: false, 
            pts: [
                {x: -12000, y: -4000}, {x: -6000, y: -9000}, {x: 0, y: -5000}, 
                {x: 6000, y: -9000}, {x: 12000, y: -4000}, {x: 9000, y: 6000}, 
                {x: 0, y: 10000}, {x: -9000, y: 6000}
            ] // Fun, wavy, organic paths
        }
    ];

    // Push the 5 new tracks onto the global registry (indices 8 through 12)
    trackDefs.push(...dlcTracks);
};

const injectMapSelectUI = () => {
    const style = document.createElement('style');
    style.id = 'dlc-map-styles';
    style.innerHTML = `
        #screen-map-select {
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, rgba(15,15,20,0.95) 0%, rgba(5,5,10,0.98) 100%);
        }
        
        .cup-container {
            display: flex;
            gap: 4vw;
            margin-top: 2vh;
            width: 90%;
            max-width: 1400px;
            justify-content: center;
        }
        
        .cup-card {
            flex: 1;
            height: 55vh;
            min-height: 400px;
            background: linear-gradient(180deg, #1a1a24 0%, #0a0a0f 100%);
            border: 6px solid #333;
            border-radius: 24px;
            padding: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0,0,0,0.8);
        }
        
        .cup-card.selected {
            border-color: var(--switch-cyan, #00ffff);
            transform: scale(1.05) translateY(-15px);
            background: linear-gradient(180deg, #2a2a3a 0%, #101018 100%);
            box-shadow: 0 30px 60px rgba(0,255,255,0.2), inset 0 0 40px rgba(0,255,255,0.1);
        }
        
        .cup-title {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            font-style: italic;
            font-size: clamp(2.5rem, 5vw, 4rem);
            color: #fff;
            text-align: center;
            margin-bottom: 5px;
            text-shadow: 3px 3px 0 #000;
            letter-spacing: 2px;
        }
        
        .cup-card.selected .cup-title {
            color: var(--switch-cyan, #00ffff);
            text-shadow: 0 0 20px rgba(0,255,255,0.8);
        }
        
        .cup-desc {
            color: #888; 
            font-weight: 800; 
            font-size: 1.2rem;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 3px;
        }

        .cup-tracks {
            font-family: 'Press Start 2P', monospace;
            font-size: clamp(0.7rem, 1.5vw, 1.2rem);
            color: #bbb;
            line-height: 2.5;
            text-align: center;
            width: 100%;
        }
        
        .cup-tracks span { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); }

        .dlc-badge {
            position: absolute;
            top: -25px;
            right: -35px;
            background: var(--switch-red, #e60012);
            color: #fff;
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            padding: 40px 50px 10px 50px;
            transform: rotate(45deg);
            font-size: 1.5rem;
            box-shadow: 0 10px 20px rgba(0,0,0,0.6);
            letter-spacing: 2px;
        }
    `;
    document.head.appendChild(style);

    const mapScreen = document.createElement('div');
    mapScreen.id = 'screen-map-select';
    mapScreen.className = 'screen';
    mapScreen.innerHTML = `
        <h2 style="font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 2vh; color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.3);">CHOOSE YOUR GRAND PRIX</h2>
        <div class="cup-container">
            <div class="cup-card selected" id="cup-0">
                <div class="cup-title">NEON CUP</div>
                <div class="cup-desc">ORIGINAL GRAND PRIX CIRCUITS</div>
                <div class="cup-tracks">
                    <span>1.</span> THE CLASSIC<br>
                    <span>2.</span> CYBER BEAN<br>
                    <span>3.</span> SYNTH ZIGZAG<br>
                    <span>4.</span> HYPER STAR<br>
                    <span>5.</span> NEON OVAL<br>
                    <span>6.</span> DESERT SERPENT<br>
                    <span>7.</span> THE OCTAGON<br>
                    <span>8.</span> CIRCUIT LOOP
                </div>
            </div>
            
            <div class="cup-card" id="cup-1">
                <div class="dlc-badge">NEW!</div>
                <div class="cup-title" style="color: #ff00ff;">SPECIAL CUP</div>
                <div class="cup-desc">MARIO KART EXPANSION TRACKS</div>
                <div class="cup-tracks" style="color: #ddd;">
                    <span style="color:#ff00ff;">1.</span> RAINBOW ROAD<br>
                    <span style="color:#ff3300;">2.</span> BOWSER'S CITADEL<br>
                    <span style="color:#32cd32;">3.</span> MOO MOO HIGHWAY<br>
                    <span style="color:#ffaa00;">4.</span> TOAD'S TURNPIKE<br>
                    <span style="color:#00c3e3;">5.</span> YOSHI'S ISLAND
                </div>
            </div>
        </div>
        <div style="margin-top: 4vh; display: flex; align-items: center; font-weight: 900; font-size: 1.8rem; color: #fff;" class="blink">
            P1: PRESS <span class="btn-prompt btn-a">A</span> TO CONFIRM
        </div>
    `;
    document.getElementById('ui-layer').appendChild(mapScreen);
};

setTimeout(() => {
    injectMapSelectUI();
    injectDLC();

    // 1. Un-intercepted copy of the original race starter logic
    window.forceStartRaceSetup = typeof startRaceSetup === 'function' ? startRaceSetup : () => console.error('startRaceSetup not found');

    // 2. Intercept the automated race setup to divert players to the Map Screen
    if (typeof startRaceSetup === 'function') {
        window.startRaceSetup = function() {
            if (gameState.phase === 'lobby') {
                // Safely block the race from starting and switch to Map Selection!
                changePhase('map_select');
            } else {
                // If we are already past the lobby (e.g. moving between tracks in a tournament), proceed normally
                window.forceStartRaceSetup();
            }
        };
    }

    // 3. Register the new UI phase in the Screen Manager
    if (typeof changePhase === 'function') {
        const originalChangePhase13 = changePhase;
        window.changePhase = function(newPhase) {
            originalChangePhase13(newPhase);
            if (newPhase === 'map_select') {
                // Hide all standard screens, explicitly show our map select
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                document.getElementById('screen-map-select').classList.add('active');
                window.gameState.mapSelection = 0; // Default to Neon Cup
                updateMapSelectGraphics();
            }
        };
    }

    // 4. Input Handler for Map Selection (D-Pad / A Button)
    if (typeof handleUIEvent === 'function') {
        const originalHandleUI13 = handleUIEvent;
        window.handleUIEvent = function(inputId, actionType) {
            
            if (typeof gameState !== 'undefined' && gameState.phase === 'map_select') {
                // Restrict UI navigation to Player 1 (KB1 or Pad1)
                if (inputId === 0 || inputId === 2) {
                    if (actionType === 'left' || actionType === 'right') {
                        gameState.mapSelection = 1 - gameState.mapSelection; // Toggles between 0 and 1
                        updateMapSelectGraphics();
                        if(typeof playSound === 'function') playSound('blip');
                    } 
                    else if (actionType === 'action') {
                        if(typeof playSound === 'function') playSound('ready');
                        
                        // Populate track order based on cup chosen
                        if (gameState.mapSelection === 0) {
                            // Neon Cup (Original 8 Tracks)
                            gameState.trackOrder = [0, 1, 2, 3, 4, 5, 6, 7];
                        } else {
                            // Special Cup (The 5 New MK DLC Tracks)
                            gameState.trackOrder = [8, 9, 10, 11, 12];
                        }
                        
                        // Shuffle the chosen cup's tracks
                        if (typeof shuffleArray === 'function') shuffleArray(gameState.trackOrder);
                        
                        // Reset points and trigger the authentic race start
                        gameState.currentTrackIdx = 0;
                        players.forEach(p => p.totalPts = 0);
                        
                        // Use our cached un-intercepted function to actually boot the physics engine
                        window.forceStartRaceSetup();
                    }
                }
                return; // Consume the input so base game doesn't process it
            }
            
            // Allow all other game inputs to flow normally
            originalHandleUI13(inputId, actionType);
        };
    }

    // 5. Update footer prompts if the Switch UI (Addon 6) is active
    if (typeof updateFooterPrompts === 'function') {
        const origFooter13 = updateFooterPrompts;
        window.updateFooterPrompts = function(phase) {
            origFooter13(phase);
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

    // Make Rainbow Road physically shift colors in real-time
    if (typeof drawTrack === 'function') {
        const originalDrawTrack13 = drawTrack;
        window.drawTrack = function() {
            if (currentTrack && currentTrack.name === "RAINBOW ROAD") {
                // Calculate dynamic HSL color based on system time clock
                const hue = (Date.now() * 0.15) % 360;
                currentTrack.color = `hsl(${hue}, 100%, 60%)`;
            }
            originalDrawTrack13();
        };
    }

}, 2000); // 2000ms delay ensures this hooks the engine AFTER all previous addons load

function updateMapSelectGraphics() {
    const cup0 = document.getElementById('cup-0');
    const cup1 = document.getElementById('cup-1');
    
    if (cup0 && cup1) {
        if (window.gameState.mapSelection === 0) {
            cup0.classList.add('selected');
            cup1.classList.remove('selected');
            cup1.style.borderColor = '#333';
        } else {
            cup1.classList.add('selected');
            cup0.classList.remove('selected');
            // Give DLC card a special dynamic glowing magenta color when selected
            cup1.style.borderColor = '#ff00ff';
        }
    }
}
