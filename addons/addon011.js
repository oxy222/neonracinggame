// addons/addon11.js - The Polish Update
// - Deeper/louder motor grumble
// - Faster addon loading
// - Controller input fix for title screen
// - High-quality arcade camera & zoom
// - Return to title from setup
// - Removes Ferrari

// 1. Fast-forward initial timeouts to drastically speed up addon initialization
if (!window.addonLoadOptimized) {
    window.addonLoadOptimized = true;
    const originalTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
        // If it's a large setup delay from previous addons and the game just started
        if (delay >= 500 && delay <= 2000 && performance.now() < 3000) {
            return originalTimeout(callback, 20); // Crush the delay down to 20ms
        }
        return originalTimeout(callback, delay);
    };
}

// 2. High-Quality Arcade Camera (Smooth Panning & Reasonable Zoom Limits)
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

            // If there's only one target, enforce a minimum synthetic box size to prevent infinite zoom-in
            if (targets.length === 1) {
                minX -= 500; maxX += 500;
                minY -= 500; maxY += 500;
            }

            const midX = (maxX + minX) / 2;
            const midY = (maxY + minY) / 2;

            // Smooth linear interpolation for panning
            gameState.camera.x += (midX - gameState.camera.x) * 0.1;
            gameState.camera.y += (midY - gameState.camera.y) * 0.1;

            const boxWidth = maxX - minX;
            const boxHeight = maxY - minY;

            const padding = 1500; // High quality arcade framing padding
            const scaleX = windowWidth / (boxWidth + padding);
            const scaleY = windowHeight / (boxHeight + padding);

            let targetScale = Math.min(scaleX, scaleY);
            
            // Clamp the zoom to keep it reasonable (0.35 max zoom out, 0.8 max zoom in)
            targetScale = Math.max(0.35, Math.min(targetScale, 0.8)); 

            // Smooth interpolation for zooming
            gameState.camera.scale += (targetScale - gameState.camera.scale) * 0.05;
        };
    }

    // 3. Controller Input Fix upon returning to Title Screen
    if (typeof changePhase === 'function') {
        const originalChangePhase11 = changePhase;
        window.changePhase = function(newPhase) {
            originalChangePhase11(newPhase);
            if (newPhase === 'menu') {
                // Force clear all input states to prevent "stuck" buttons locking out menus
                if (typeof prevActionStates !== 'undefined') {
                    for(let i=0; i<prevActionStates.length; i++) prevActionStates[i] = false;
                }
                if (typeof prevInputState !== 'undefined') {
                    prevInputState.forEach(s => {
                        for (let key in s) s[key] = false;
                    });
                }
                // Force un-ready all players just to be safe
                players.forEach(p => { p.joined = false; p.ready = false; });
            }
        };
    }

    // 4. Return to Title from Setup & Remove Ferrari
    if (typeof handleUIEvent === 'function') {
        const baseUI11 = handleUIEvent;
        window.handleUIEvent = function(inputId, actionType) {
            const p = players.find(x => x.inputId === inputId);

            if (gameState.phase === 'lobby') {
                // Feature: Return to Title
                if (actionType === 'cancel') {
                    // Let the base game handle un-joining if they are currently joined
                    baseUI11(inputId, actionType);
                    
                    // Immediately check if the lobby is now empty. If so, return to title.
                    setTimeout(() => {
                        const anyJoined = players.some(x => x.joined);
                        if (!anyJoined && gameState.phase === 'lobby') {
                            changePhase('menu');
                        }
                    }, 20); 
                    return; 
                }

                // Feature: Remove Ferrari (Index 1) from rotation
                if (p && !p.ready) {
                    if (actionType === 'left') {
                        p.carModel = (p.carModel + 7) % 8; // 8 cars total
                        if (p.carModel === 1) p.carModel = 0; // Skip Ferrari
                        if(typeof playSound==='function') playSound('blip');
                        if(typeof updateLobbyUI === 'function') updateLobbyUI();
                        return;
                    }
                    if (actionType === 'right') {
                        p.carModel = (p.carModel + 1) % 8;
                        if (p.carModel === 1) p.carModel = 2; // Skip Ferrari
                        if(typeof playSound==='function') playSound('blip');
                        if(typeof updateLobbyUI === 'function') updateLobbyUI();
                        return;
                    }
                }
            }
            
            // Allow all other inputs to flow naturally
            baseUI11(inputId, actionType);
        };
    }

    // Instantly force anyone currently on Ferrari to switch to Hellcat
    players.forEach(p => { if (p.carModel === 1) p.carModel = 2; });

    if (typeof updateLobbyUI === 'function') {
        const oldLobby11 = updateLobbyUI;
        window.updateLobbyUI = function() {
            oldLobby11();
            // Finalize display names with Ferrari stripped
            players.forEach((p, i) => {
                const name = document.getElementById(`name-slot-${i}`);
                if (name && p.joined) {
                    if (p.carModel === 0) name.innerText = 'NISSAN SKYLINE';
                    if (p.carModel === 2) name.innerText = 'DODGE HELLCAT';
                    if (p.carModel === 3) name.innerText = 'TRACKHAWK JEEP';
                    if (p.carModel === 4) name.innerText = 'DODGE CHARGER';
                    if (p.carModel === 5) name.innerText = 'MAZDA MIATA';
                    if (p.carModel === 6) name.innerText = 'FORD MUSTANG';
                    if (p.carModel === 7) name.innerText = 'CHEVY CORVETTE';
                }
            });
        };
        if (gameState && gameState.phase === 'lobby') window.updateLobbyUI();
    }
}, 100); 

// 5. Enhanced Deeper / Louder Motor Grumble
const startEnhancedGrumble = () => {
    // Wait for AudioContext to exist
    if (typeof actx === 'undefined' || !actx) return requestAnimationFrame(startEnhancedGrumble);

    let subOsc = null, subGain = null;
    let midOsc = null, midGain = null;

    const updateSubAudio = () => {
        if (!subOsc && actx.state === 'running') {
            // Setup Deep Sub-Bass Oscillator
            subOsc = actx.createOscillator();
            subOsc.type = 'sine';
            subGain = actx.createGain();
            subGain.gain.value = 0;
            subOsc.connect(subGain);
            subGain.connect(actx.destination);
            subOsc.start();

            // Setup Throaty Mid-Range Oscillator
            midOsc = actx.createOscillator();
            midOsc.type = 'triangle';
            midGain = actx.createGain();
            midGain.gain.value = 0;
            midOsc.connect(midGain);
            midGain.connect(actx.destination);
            midOsc.start();
        }

        if (subOsc && typeof gameState !== 'undefined' && gameState.phase === 'racing') {
            const activeRacers = players.filter(p => p.joined && !p.finished);
            let maxSpeed = 0;
            activeRacers.forEach(p => { 
                if (Math.abs(p.speed) > maxSpeed) maxSpeed = Math.abs(p.speed); 
            });

            // Calculate true speed ratio including CC multiplier
            let currentMax = 28 * (window.NeonGP?.ccMode ? window.NeonGP.ccMode / 100 : 1);
            const speedRatio = maxSpeed / currentMax;

            // Kick in earlier (mid speeds) and roar up to top speeds
            if (speedRatio > 0.3) {
                // Scales beautifully from 0.0 to 1.4 intensity
                const intensity = Math.min(1.4, (speedRatio - 0.3) * 1.5); 

                // Plunge into deeper Sub Bass (30Hz to 60Hz)
                subGain.gain.setTargetAtTime(intensity * 0.4, actx.currentTime, 0.1); 
                subOsc.frequency.setTargetAtTime(30 + (intensity * 30), actx.currentTime, 0.1);

                // Throaty Mid-Range growl (60Hz to 120Hz)
                midGain.gain.setTargetAtTime(intensity * 0.15, actx.currentTime, 0.1); 
                midOsc.frequency.setTargetAtTime(60 + (intensity * 60), actx.currentTime, 0.1);
            } else {
                subGain.gain.setTargetAtTime(0, actx.currentTime, 0.1);
                midGain.gain.setTargetAtTime(0, actx.currentTime, 0.1);
            }
        } else if (subGain) {
            // Silence in menus
            subGain.gain.setTargetAtTime(0, actx.currentTime, 0.1);
            midGain.gain.setTargetAtTime(0, actx.currentTime, 0.1);
        }

        requestAnimationFrame(updateSubAudio);
    };
    
    updateSubAudio();
};

startEnhancedGrumble();
