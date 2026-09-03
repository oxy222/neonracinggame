// addons/addon10.js - Vehicle Expansion Pack 2 (Skyline, Mustang, Corvette) & Engine Audio
// Overwrites Model 0 (F1) with a Skyline, expands bounds to 8 to fit Mustang and Corvette, and adds a dynamic speed-based engine grumble.

const skylineSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
    <!-- Wide Tires -->
    <rect x="6" y="25" width="16" height="40" rx="3" fill="#050505"/>
    <rect x="78" y="25" width="16" height="40" rx="3" fill="#050505"/>
    <rect x="6" y="140" width="16" height="40" rx="3" fill="#050505"/>
    <rect x="78" y="140" width="16" height="40" rx="3" fill="#050505"/>
    <!-- Main Chassis -->
    <path d="M 15 15 L 85 15 L 90 60 L 88 150 L 85 190 L 15 190 L 12 150 L 10 60 Z" fill="VAR_COLOR"/>
    <!-- Hood details & Intercooler -->
    <rect x="30" y="10" width="40" height="8" rx="2" fill="#111"/>
    <rect x="35" y="12" width="30" height="4" fill="#ccc"/>
    <path d="M 35 25 L 65 25 L 70 45 L 30 45 Z" fill="#222" opacity="0.4"/>
    <rect x="42" y="30" width="16" height="10" rx="2" fill="#000"/>
    <!-- Headlights -->
    <rect x="18" y="16" width="20" height="10" rx="2" fill="#eef"/>
    <rect x="62" y="16" width="20" height="10" rx="2" fill="#eef"/>
    <circle cx="23" cy="21" r="3" fill="#fff"/>
    <circle cx="77" cy="21" r="3" fill="#fff"/>
    <!-- Windshield -->
    <path d="M 20 70 L 80 70 L 72 105 L 28 105 Z" fill="#151520"/>
    <!-- Roof -->
    <rect x="28" y="105" width="44" height="40" fill="VAR_COLOR"/>
    <!-- Rear Window -->
    <path d="M 28 145 L 72 145 L 80 170 L 20 170 Z" fill="#151520"/>
    <!-- Iconic Taillights -->
    <rect x="15" y="185" width="70" height="10" rx="3" fill="#222"/>
    <circle cx="25" cy="190" r="4.5" fill="#f00" stroke="#500" stroke-width="1"/>
    <circle cx="37" cy="190" r="3.5" fill="#f00" stroke="#500" stroke-width="1"/>
    <circle cx="63" cy="190" r="3.5" fill="#f00" stroke="#500" stroke-width="1"/>
    <circle cx="75" cy="190" r="4.5" fill="#f00" stroke="#500" stroke-width="1"/>
    <!-- Rear Wing -->
    <rect x="10" y="175" width="80" height="4" fill="#111"/>
    <rect x="15" y="170" width="4" height="12" fill="#333"/>
    <rect x="81" y="170" width="4" height="12" fill="#333"/>
    <!-- Exhaust -->
    <circle cx="20" cy="198" r="3" fill="#aaa"/>
</svg>`;

const mustangSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
    <!-- Tires -->
    <rect x="4" y="25" width="18" height="42" rx="4" fill="#111"/>
    <rect x="78" y="25" width="18" height="42" rx="4" fill="#111"/>
    <rect x="4" y="135" width="18" height="45" rx="4" fill="#111"/>
    <rect x="78" y="135" width="18" height="45" rx="4" fill="#111"/>
    <!-- Body -->
    <path d="M 18 15 Q 50 5 82 15 C 88 30 90 150 85 185 Q 50 195 15 185 C 10 150 12 30 18 15 Z" fill="VAR_COLOR"/>
    <!-- Racing Stripes -->
    <path d="M 40 10 L 40 190" stroke="#fff" stroke-width="6" opacity="0.8"/>
    <path d="M 60 10 L 60 190" stroke="#fff" stroke-width="6" opacity="0.8"/>
    <!-- Front Grille & Headlights -->
    <rect x="25" y="12" width="50" height="10" fill="#111"/>
    <rect x="45" y="13" width="10" height="8" rx="2" fill="#333"/> 
    <path d="M 18 15 L 28 17 L 28 22 L 15 20 Z" fill="#eef"/>
    <path d="M 82 15 L 72 17 L 72 22 L 85 20 Z" fill="#eef"/>
    <!-- Hood Scoop -->
    <path d="M 35 30 L 65 30 L 70 60 L 30 60 Z" fill="#222" opacity="0.4"/>
    <rect x="40" y="32" width="20" height="5" fill="#000"/>
    <!-- Windshield -->
    <path d="M 22 75 Q 50 65 78 75 L 72 105 Q 50 100 28 105 Z" fill="#1a1a24"/>
    <!-- Roof -->
    <rect x="28" y="105" width="44" height="45" rx="4" fill="VAR_COLOR"/>
    <!-- Fastback Rear Window -->
    <path d="M 30 150 L 70 150 L 76 175 L 24 175 Z" fill="#1a1a24"/>
    <!-- Tri-bar Taillights -->
    <rect x="18" y="183" width="6" height="8" rx="1" fill="#f00"/>
    <rect x="26" y="184" width="6" height="8" rx="1" fill="#f00"/>
    <rect x="34" y="185" width="6" height="8" rx="1" fill="#f00"/>
    <rect x="76" y="183" width="6" height="8" rx="1" fill="#f00"/>
    <rect x="68" y="184" width="6" height="8" rx="1" fill="#f00"/>
    <rect x="60" y="185" width="6" height="8" rx="1" fill="#f00"/>
    <!-- Exhausts -->
    <circle cx="25" cy="195" r="3.5" fill="#666"/>
    <circle cx="75" cy="195" r="3.5" fill="#666"/>
</svg>`;

const corvetteSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
    <!-- Tires -->
    <rect x="8" y="25" width="15" height="40" rx="3" fill="#0a0a0a"/>
    <rect x="77" y="25" width="15" height="40" rx="3" fill="#0a0a0a"/>
    <rect x="5" y="130" width="18" height="45" rx="3" fill="#0a0a0a"/>
    <rect x="77" y="130" width="18" height="45" rx="3" fill="#0a0a0a"/>
    <!-- Aggressive Aero Body -->
    <path d="M 50 5 L 80 30 L 92 110 L 85 185 L 50 195 L 15 185 L 8 110 L 20 30 Z" fill="VAR_COLOR"/>
    <!-- Front Splitter & Intakes -->
    <path d="M 40 8 L 60 8 L 75 20 L 80 30 L 20 30 L 25 20 Z" fill="#111"/>
    <path d="M 50 5 L 60 15 L 40 15 Z" fill="VAR_COLOR"/>
    <!-- Angular Headlights -->
    <polygon points="25,25 35,15 40,30 20,40" fill="#fff" opacity="0.9"/>
    <polygon points="75,25 65,15 60,30 80,40" fill="#fff" opacity="0.9"/>
    <!-- Windshield / Canopy -->
    <path d="M 35 75 Q 50 60 65 75 L 75 110 Q 50 120 25 110 Z" fill="#151520"/>
    <!-- Roof -->
    <path d="M 35 110 L 65 110 L 60 130 L 40 130 Z" fill="VAR_COLOR"/>
    <!-- Mid-Engine Glass -->
    <polygon points="40,130 60,130 55,165 45,165" fill="#151520"/>
    <rect x="47" y="135" width="6" height="25" fill="#444"/>
    <!-- Side Intakes (Boomerangs) -->
    <polygon points="12,110 25,110 30,130 8,140" fill="#050505"/>
    <polygon points="88,110 75,110 70,130 92,140" fill="#050505"/>
    <!-- Rear Wing -->
    <path d="M 15 175 Q 50 165 85 175 L 90 182 Q 50 175 10 182 Z" fill="#111"/>
    <!-- Angular Taillights -->
    <polygon points="20,185 40,182 42,187 22,190" fill="#f00"/>
    <polygon points="80,185 60,182 58,187 78,190" fill="#f00"/>
    <!-- Quad Exhaust Tips -->
    <rect x="35" y="192" width="6" height="5" rx="1" fill="#ccc"/>
    <rect x="43" y="192" width="6" height="5" rx="1" fill="#ccc"/>
    <rect x="51" y="192" width="6" height="5" rx="1" fill="#ccc"/>
    <rect x="59" y="192" width="6" height="5" rx="1" fill="#ccc"/>
</svg>`;

setTimeout(() => {
    // 1. Hook getCarSVG to inject our SVGs, overriding modelIdx 0 (F1) and handling 6/7
    if (typeof getCarSVG === 'function') {
        const originalGetCar10 = getCarSVG;
        window.getCarSVG = function(modelIdx, colorHex) {
            if (modelIdx === 0) return createAddonCarSVG(skylineSVG, colorHex, '0');
            if (modelIdx === 6) return createAddonCarSVG(mustangSVG, colorHex, '6');
            if (modelIdx === 7) return createAddonCarSVG(corvetteSVG, colorHex, '7');
            return originalGetCar10(modelIdx, colorHex);
        }
    }
    
    // Shared Cache helper in case Addon 9 isn't active
    if (typeof createAddonCarSVG !== 'function') {
        window.addonCarCache = window.addonCarCache || {};
        window.createAddonCarSVG = function(svgTpl, color, id) {
            const key = `${id}_${color}`;
            if (addonCarCache[key]) return addonCarCache[key];
            const finalSVG = svgTpl.replace(/VAR_COLOR/g, color);
            const img = new Image();
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(finalSVG);
            addonCarCache[key] = img;
            return img;
        }
    }

    // 2. Expand handleUIEvent bounds. Running this at 1500ms ensures it wraps Addon 9's hook.
    if (typeof handleUIEvent === 'function') {
        const originalUI10 = handleUIEvent;
        window.handleUIEvent = function(inputId, actionType) {
            const p = players.find(x => x.inputId === inputId);
            
            // Re-intercept Left/Right in lobby and force calculations over an 8-car array (0 to 7)
            if (gameState.phase === 'lobby' && p && !p.ready) {
                if (actionType === 'left') { 
                    p.carModel = (p.carModel + 7) % 8; // Loops perfectly around 8
                    if(typeof playSound==='function') playSound('blip'); 
                    if(typeof updateLobbyUI === 'function') updateLobbyUI();
                    return; // Halt to bypass base game AND addon 9 limits
                }
                if (actionType === 'right') { 
                    p.carModel = (p.carModel + 1) % 8; 
                    if(typeof playSound==='function') playSound('blip'); 
                    if(typeof updateLobbyUI === 'function') updateLobbyUI();
                    return; // Halt to bypass base game AND addon 9 limits
                }
            }
            
            originalUI10(inputId, actionType);
        }
    }
    
    // 3. Update the display names in the lobby
    if (typeof updateLobbyUI === 'function') {
        const origLobby10 = updateLobbyUI;
        window.updateLobbyUI = function() {
            origLobby10(); // Allow previous logic to run first
            players.forEach((p, i) => {
                const name = document.getElementById(`name-slot-${i}`);
                if (name && p.joined) {
                    if (p.carModel === 0) name.innerText = 'NISSAN SKYLINE';
                    if (p.carModel === 6) name.innerText = 'FORD MUSTANG';
                    if (p.carModel === 7) name.innerText = 'CHEVY CORVETTE';
                }
            });
        }
        
        // Trigger instant refresh
        if (typeof gameState !== 'undefined' && gameState.phase === 'lobby') window.updateLobbyUI();
    }
}, 1500);

// 4. Implement Dynamic Engine Taptic Sound Effect
let grumbleOsc = null;
let grumbleGain = null;
let grumbleFilter = null;

const startEngineAudioLoop = () => {
    // Rely on global actx context generated by base game
    if (typeof actx === 'undefined' || !actx) return requestAnimationFrame(startEngineAudioLoop);

    const updateGrumble = () => {
        if (!grumbleOsc && actx.state === 'running') {
            // Setup Synthesizer architecture for Engine Sound
            grumbleOsc = actx.createOscillator();
            grumbleOsc.type = 'sawtooth';
            
            grumbleFilter = actx.createBiquadFilter();
            grumbleFilter.type = 'lowpass';
            grumbleFilter.frequency.value = 150; // Heavily muffled bass
            
            grumbleGain = actx.createGain();
            grumbleGain.gain.value = 0; // Starts silent
            
            grumbleOsc.connect(grumbleFilter);
            grumbleFilter.connect(grumbleGain);
            grumbleGain.connect(actx.destination);
            
            grumbleOsc.start();
        }

        if (grumbleOsc && typeof gameState !== 'undefined' && gameState.phase === 'racing') {
            // Find highest speed among all active players
            const activeRacers = players.filter(p => p.joined && !p.finished);
            let maxSpeed = 0;
            activeRacers.forEach(p => {
                if (Math.abs(p.speed) > maxSpeed) maxSpeed = Math.abs(p.speed);
            });

            // Assess current CC speed limit
            let currentMax = 28; 
            if (window.NeonGP && window.NeonGP.ccMode) {
                currentMax = 28 * (window.NeonGP.ccMode / 100);
            }

            const speedRatio = maxSpeed / currentMax;
            
            // As players cross 75% of their top speed, begin rumbling
            if (speedRatio > 0.75) {
                const intensity = Math.min(1.0, (speedRatio - 0.75) * 4); // Scales smoothly from 0.0 to 1.0
                
                // Ramp volume slightly to create a palpable taptic purr
                grumbleGain.gain.setTargetAtTime(intensity * 0.15, actx.currentTime, 0.1);
                
                // Modulate frequency between 40Hz (Idle) and 80Hz (Redline) for visceral engine revs
                const targetFreq = 40 + (intensity * 40);
                grumbleOsc.frequency.setTargetAtTime(targetFreq, actx.currentTime, 0.1);
                
                // Open lowpass filter slightly at max speed to simulate engine roar
                grumbleFilter.frequency.setTargetAtTime(150 + (intensity * 200), actx.currentTime, 0.1);
            } else {
                grumbleGain.gain.setTargetAtTime(0, actx.currentTime, 0.1);
            }
        } else if (grumbleGain) {
            // Cut sound in menus or paused
            grumbleGain.gain.setTargetAtTime(0, actx.currentTime, 0.1);
        }

        requestAnimationFrame(updateGrumble);
    };
    
    updateGrumble();
};

startEngineAudioLoop();
