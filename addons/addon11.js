// addons/addon11.js - The Polish Update (Revised)
// - Liquid glass beta loading screen
// - Definitively fixes menu lockouts on title screen
// - Allows returning to title from lobby with B button
// - Perfected infinite-zoom arcade camera for high speeds
// - Motor hum kicks in on acceleration and roars at top speed

const initBetaLoader = () => {
    // Only run this once per session
    if (sessionStorage.getItem('neon_beta_loaded')) return;
    sessionStorage.setItem('neon_beta_loaded', 'true');

    const loader = document.createElement('div');
    loader.id = 'liquid-glass-loader';
    loader.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        background: radial-gradient(circle at center, rgba(15,15,20,0.4) 0%, rgba(5,5,10,0.9) 100%);
        backdrop-filter: blur(25px) saturate(150%);
        -webkit-backdrop-filter: blur(25px) saturate(150%);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: all; /* Block clicks */
    `;

    // Liquid/Shiny Text Effect via CSS
    loader.innerHTML = `
        <style>
            @keyframes glassShine {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }
            .liquid-text {
                font-family: 'Montserrat', sans-serif; font-weight: 900; font-style: italic;
                font-size: clamp(2rem, 5vw, 5rem); text-align: center; margin: 0;
                color: transparent;
                background: linear-gradient(110deg, rgba(255,255,255,0.2) 20%, rgba(255,255,255,1) 40%, rgba(0,255,255,1) 50%, rgba(255,255,255,1) 60%, rgba(255,255,255,0.2) 80%);
                background-size: 200% auto;
                -webkit-background-clip: text;
                background-clip: text;
                animation: glassShine 2.5s linear infinite;
                filter: drop-shadow(0 0 20px rgba(0,255,255,0.5));
            }
        </style>
        <div class="liquid-text">SWITCHING TO<br>BETA UPDATE</div>
    `;

    document.body.appendChild(loader);

    // Fade out and destroy after 3.5 seconds
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 800);
    }, 3500);
};
initBetaLoader();

if (!window.addonLoadOptimized) {
    window.addonLoadOptimized = true;
    const originalTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
        if (delay >= 500 && delay <= 2000 && performance.now() < 3000) {
            return originalTimeout(callback, 20); // Crush the delay down to 20ms
        }
        return originalTimeout(callback, delay);
    };
}

setTimeout(() => {
    if (typeof updateCamera === 'function') {
        window.updateCamera = function() {
            const targets = players.filter(p => p.joined && (!p.finished || gameState.finishers === players.filter(x=>x.joined).length));
            if (targets.length === 0) return;

            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            targets.forEach(p => {
                if (p.x < minX) minX = p.x;
                if (p.x > maxX) maxX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.y > maxY) maxY = p.y;
            });

            if (targets.length === 1) {
                minX -= 600; maxX += 600;
                minY -= 600; maxY += 600;
            }

            const midX = (maxX + minX) / 2;
            const midY = (maxY + minY) / 2;

            // Doubled the panning interpolation speed to keep up with 150cc cars
            gameState.camera.x += (midX - gameState.camera.x) * 0.2;
            gameState.camera.y += (midY - gameState.camera.y) * 0.2;

            const boxWidth = maxX - minX;
            const boxHeight = maxY - minY;
            const padding = 2200; // Massive padding so players never touch screen edges

            const scaleX = windowWidth / (boxWidth + padding);
            const scaleY = windowHeight / (boxHeight + padding);

            let targetScale = Math.min(scaleX, scaleY);
            
            // Removed the 0.35 minimum limit. Now scales down to 0.03 for gigantic map separation.
            // Capped maximum zoom at 0.8 so it's not claustrophobic when clustered.
            targetScale = Math.max(0.03, Math.min(targetScale, 0.8)); 

            // Fast zoom interpolation
            gameState.camera.scale += (targetScale - gameState.camera.scale) * 0.1;
        };
    }

    if (typeof changePhase === 'function') {
        const originalChangePhase11 = changePhase;
        window.changePhase = function(newPhase) {
            originalChangePhase11(newPhase);
            if (newPhase === 'menu') {
                // Aggressively wipe every possible hardware buffer state
                if (typeof prevActionStates !== 'undefined') {
                    for(let i=0; i<prevActionStates.length; i++) prevActionStates[i] = false;
                }
                if (typeof inputs !== 'undefined') {
                    inputs.forEach(inp => {
                        inp.action = false; inp.brake = false; inp.cancel = false; inp.start = false;
                        inp.up = false; inp.down = false; inp.left = false; inp.right = false;
                        inp.leftHit = false; inp.rightHit = false; inp.upHit = false; inp.downHit = false;
                    });
                }
                if (typeof keys !== 'undefined') {
                    for (let key in keys) keys[key] = false;
                }
                if (typeof prevInputState !== 'undefined') {
                    prevInputState.forEach(s => {
                        for (let key in s) s[key] = false;
                    });
                }
            }
        };
    }

    if (typeof handleUIEvent === 'function') {
        const baseUI11 = handleUIEvent;
        window.handleUIEvent = function(inputId, actionType) {
            if (gameState.phase === 'lobby' && actionType === 'cancel') {
                const p = players.find(x => x.inputId === inputId);
                const activePlayers = players.filter(x => x.joined);
                
                // If the lobby is already completely empty, OR if this specific person isn't joined
                // and they press B, take them back to the main menu instantly.
                if (activePlayers.length === 0 || !p || !p.joined) {
                    changePhase('menu');
                    if (typeof playSound === 'function') playSound('blip');
                    return; 
                }

                // Otherwise, let the base game handle un-joining/un-readying the player
                baseUI11(inputId, actionType);
                
                // If that action resulted in the lobby becoming empty, queue an exit for the next frame
                setTimeout(() => {
                    if (!players.some(x => x.joined)) {
                        changePhase('menu');
                    }
                }, 50); 
                return; 
            }
            
            // Allow all other inputs to flow naturally
            baseUI11(inputId, actionType);
        };
    }
}, 100); 

const startEnhancedGrumble = () => {
    // Wait for AudioContext to be initialized by the player
    if (typeof actx === 'undefined' || !actx) return requestAnimationFrame(startEnhancedGrumble);

    let subOsc = null, subGain = null;
    let sawOsc = null, sawGain = null;

    const updateSubAudio = () => {
        // Build synth architecture once Context is running
        if (!subOsc && actx.state === 'running') {
            // 1. Deep Sub Bass (Felt more than heard)
            subOsc = actx.createOscillator();
            subOsc.type = 'sine';
            subGain = actx.createGain();
            subGain.gain.value = 0;
            subOsc.connect(subGain);
            subGain.connect(actx.destination);
            subOsc.start();

            // 2. Throaty Engine Rasp (Sawtooth through a lowpass filter)
            sawOsc = actx.createOscillator();
            sawOsc.type = 'sawtooth';
            sawGain = actx.createGain();
            sawGain.gain.value = 0;
            const filter = actx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 250; // Muffled rasp
            sawOsc.connect(filter);
            filter.connect(sawGain);
            sawGain.connect(actx.destination);
            sawOsc.start();
        }

        if (subOsc && typeof gameState !== 'undefined' && gameState.phase === 'racing') {
            const activeRacers = players.filter(p => p.joined && !p.finished);
            let maxSpeed = 0;
            activeRacers.forEach(p => { 
                if (Math.abs(p.speed) > maxSpeed) maxSpeed = Math.abs(p.speed); 
            });

            // Adjust true speed tracking based on CC Multipliers
            let ccMult = (window.NeonGP && window.NeonGP.ccMode) ? (window.NeonGP.ccMode / 100) : 1;
            if (ccMult > 5) ccMult = ccMult / 100; // Handle arbitrary physics constants
            
            // 28 is base physics cap, * 1.6 accounts for turbo boosts
            const absoluteTopSpeed = 28 * ccMult * 1.6; 
            const speedRatio = Math.min(1.0, maxSpeed / absoluteTopSpeed);

            // Trigger the instant you hit the gas
            if (speedRatio > 0.02) {
                // Volume scales smoothly. Sub gets loud, saw adds texture.
                const volSub = 0.15 + (speedRatio * 0.7); 
                const volSaw = 0.05 + (speedRatio * 0.25); 

                // Frequency rises with speed (RPM effect)
                const freqSub = 35 + (speedRatio * 65);  // 35Hz -> 100Hz
                const freqSaw = 45 + (speedRatio * 100); // 45Hz -> 145Hz

                // Smooth linear ramps to prevent audio popping
                subGain.gain.setTargetAtTime(volSub, actx.currentTime, 0.05); 
                subOsc.frequency.setTargetAtTime(freqSub, actx.currentTime, 0.05);

                sawGain.gain.setTargetAtTime(volSaw, actx.currentTime, 0.05);
                sawOsc.frequency.setTargetAtTime(freqSaw, actx.currentTime, 0.05);
            } else {
                // Silent when stopped
                subGain.gain.setTargetAtTime(0, actx.currentTime, 0.1);
                sawGain.gain.setTargetAtTime(0, actx.currentTime, 0.1);
            }
        } else if (subGain) {
            // Instantly silence when paused, in menus, or race over
            subGain.gain.setTargetAtTime(0, actx.currentTime, 0.05);
            sawGain.gain.setTargetAtTime(0, actx.currentTime, 0.05);
        }

        requestAnimationFrame(updateSubAudio);
    };
    
    updateSubAudio();
};

startEnhancedGrumble();
