// addons/addon8.js - Race Count Selector, Return to Title, & Secret Stickman Racer
// Adds lobby configuration options and a hidden Konami code unlockable mid-race.

window.NeonGP = window.NeonGP || {};
window.NeonGP.raceCount = 3; 

const KONAMI_CODE = ['U', 'U', 'D', 'D', 'L', 'R', 'L', 'R', 'B', 'A', 'SEL'];
let inputHistories = [[], [], [], [], [], []];
let prevRawKeys = Array(6).fill().map(() => ({ U:false, D:false, L:false, R:false, B:false, A:false, S:false, SEL:false, X:false }));

const initRaceCountUI = () => {
    const lobby = document.getElementById('screen-lobby');
    if (lobby && !document.getElementById('race-count-ui')) {
        const rcDiv = document.createElement('div');
        rcDiv.id = 'race-count-ui';
        rcDiv.innerHTML = `GRAND PRIX LENGTH: <span id="rc-val" style="color:#00e5ff;">3 RACES</span> <span style="font-size:0.8rem; color:#888; display:block; margin-top:5px;">(PRESS X / 'R' TO CYCLE)</span>`;
        rcDiv.style.cssText = 'margin-bottom: 25px; font-size: 1.5rem; text-align: center; text-shadow: 0 0 10px #0ff;';
        
        const container = lobby.querySelector('.lobby-container');
        if (container) lobby.insertBefore(rcDiv, container);
        
        // Append the Return to title hint
        const controls = lobby.querySelector('.controls-box');
        if (controls && !controls.innerHTML.includes('RETURN TO TITLE')) {
            controls.innerHTML += `<div style="margin-top:15px; padding-top:15px; border-top:1px dashed #555;">
                <span style="color:#ffaa00;">B / BACKSPACE:</span> LEAVE LOBBY & RETURN TO TITLE
            </div>`;
        }
    }
};

setTimeout(() => {
    // 1. Override the race progression logic to respect the new Race Count
    if (typeof checkStandingsStart === 'function') {
        window.checkStandingsStart = function() {
            const active = players.filter(p => p.joined);
            if (active.every(p => p.ready)) {
                // Check against custom race count instead of the hardcoded array length
                if (gameState.trackIdx >= window.NeonGP.raceCount - 1) {
                    changePhase('podium');
                } else {
                    gameState.trackIdx++;
                    startRaceSetup();
                }
            }
        };
    }

    // 2. Wrap track generation so it safely loops if races (6) > tracks available (4)
    if (typeof startRaceSetup === 'function') {
        const origStartRaceSetup = window.startRaceSetup;
        window.startRaceSetup = function() {
            const absoluteIdx = gameState.trackIdx;
            // Modulo math ensures we never exceed the array bounds on long grand prixs
            gameState.trackIdx = absoluteIdx % trackDefs.length; 
            origStartRaceSetup();
            // Restore true index for tracking
            gameState.trackIdx = absoluteIdx; 
        };
    }

    // 3. Override drawing logic to intercept our secret Stickman
    if (typeof drawEmojiCar === 'function') {
        const origDrawEmojiCar = window.drawEmojiCar;
        window.drawEmojiCar = function(p) {
            if (p.isStickman) {
                drawStickman(p);
            } else {
                origDrawEmojiCar(p);
            }
        };
    }

    function drawStickman(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        
        // Draw standard player ID ring
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI*2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.stroke();

        ctx.fillStyle = p.color;
        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(`P${p.id+1}`, 0, -55);

        // --- UPRIGHT ORIENTATION LOGIC ---
        // We explicitly ignore ctx.rotate(p.angle) so he never lays on his side.
        // We simply check velocity vector to flip him left or right.
        const isMovingLeft = Math.cos(p.angle) < 0;
        if (isMovingLeft) ctx.scale(-1, 1);

        // Frantic running animation tied to speed
        const speedRatio = Math.abs(p.speed) / 28; 
        let t = 0;
        if (speedRatio > 0.05) t = Date.now() * 0.02 * Math.max(0.5, speedRatio);

        ctx.strokeStyle = p.color;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;

        // Torso
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(0, 10); 
        
        // Dynamic Legs (Sine wave driven stride)
        ctx.moveTo(0, 10);
        ctx.lineTo(Math.sin(t) * 15, 10 + Math.abs(Math.cos(t)) * 15 + 10);
        ctx.moveTo(0, 10);
        ctx.lineTo(Math.sin(t + Math.PI) * 15, 10 + Math.abs(Math.cos(t + Math.PI)) * 15 + 10);
        
        // Dynamic Arms (Counter-stride to legs)
        ctx.moveTo(0, -5);
        ctx.lineTo(Math.sin(t + Math.PI) * 15, Math.abs(Math.cos(t + Math.PI)) * 10 - 5);
        ctx.moveTo(0, -5);
        ctx.lineTo(Math.sin(t) * 15, Math.abs(Math.cos(t)) * 10 - 5);
        ctx.stroke();

        // Hollow Neon Head
        ctx.beginPath();
        ctx.arc(0, -23, 7, 0, Math.PI*2);
        ctx.fillStyle = '#020205'; 
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    // 4. Overhaul input polling to catch D-Pad inputs for Konami Code and explicit B/X button actions
    if (typeof pollInput === 'function') {
        const origPollInput = window.pollInput;
        
        window.pollInput = function() {
            origPollInput();
            
            if (gameState.phase === 'lobby') initRaceCountUI();
            
            const gps = navigator.getGamepads ? navigator.getGamepads() : [];
            
            for(let i=0; i<6; i++) {
                let curr = { U:false, D:false, L:false, R:false, B:false, A:false, S:false, SEL:false, X:false };
                
                // Keyboard 1
                if (i === 0) { 
                    curr.U = !!keys['KeyW']; curr.D = !!keys['KeyS']; curr.L = !!keys['KeyA']; curr.R = !!keys['KeyD'];
                    curr.B = !!keys['ShiftLeft'] || !!keys['Backspace']; curr.A = !!keys['Space']; curr.S = !!keys['Escape'];
                    curr.SEL = !!keys['Tab']; curr.X = !!keys['KeyR'];
                } 
                // Keyboard 2
                else if (i === 1) { 
                    curr.U = !!keys['ArrowUp']; curr.D = !!keys['ArrowDown']; curr.L = !!keys['ArrowLeft']; curr.R = !!keys['ArrowRight'];
                    curr.B = !!keys['ShiftRight'] || !!keys['Backspace']; curr.A = !!keys['Enter']; curr.S = !!keys['Escape'];
                    curr.SEL = !!keys['Backslash']; curr.X = !!keys['KeyR'];
                } 
                // Gamepads
                else { 
                    const pad = gps[i-2];
                    if (pad) {
                        curr.U = pad.buttons[12]?.pressed || pad.axes[1] < -0.5;
                        curr.D = pad.buttons[13]?.pressed || pad.axes[1] > 0.5;
                        curr.L = pad.buttons[14]?.pressed || pad.axes[0] < -0.5;
                        curr.R = pad.buttons[15]?.pressed || pad.axes[0] > 0.5;
                        curr.B = pad.buttons[1]?.pressed;
                        curr.A = pad.buttons[0]?.pressed;
                        curr.S = pad.buttons[9]?.pressed; // Start Button
                        curr.SEL = pad.buttons[8]?.pressed; // Select Button
                        curr.X = pad.buttons[2]?.pressed; // X Button
                    }
                }
                
                const pKeys = prevRawKeys[i];
                
                // Track Konami Sequence
                ['U','D','L','R','B','A','SEL'].forEach(k => {
                    if (curr[k] && !pKeys[k]) {
                        inputHistories[i].push(k);
                        if (inputHistories[i].length > 11) inputHistories[i].shift();
                        
                        // Check for successful unlock mid-race
                        if (inputHistories[i].join('') === KONAMI_CODE.join('')) {
                            const player = players.find(p => p.inputId === i);
                            if (player && gameState.phase === 'racing') {
                                player.isStickman = true;
                                if (typeof playSound === 'function') playSound('ready');
                                inputHistories[i] = []; // Reset sequence
                            }
                        }
                    }
                });

                // Lobby Menu Logic Intercepts
                if (gameState.phase === 'lobby') {
                    // Cycle Race Counts (1 -> 3 -> 6)
                    if (curr.X && !pKeys.X) {
                        window.NeonGP.raceCount = window.NeonGP.raceCount === 1 ? 3 : (window.NeonGP.raceCount === 3 ? 6 : 1);
                        const valText = window.NeonGP.raceCount === 1 ? '1 RACE' : `${window.NeonGP.raceCount} RACES`;
                        const valColor = window.NeonGP.raceCount === 6 ? '#bbff00' : (window.NeonGP.raceCount === 3 ? '#00e5ff' : '#ff0055');
                        
                        document.getElementById('rc-val').innerText = valText;
                        document.getElementById('rc-val').style.color = valColor;
                        document.getElementById('rc-val').style.textShadow = `0 0 10px ${valColor}`;
                        if (typeof playSound === 'function') playSound('blip');
                    }
                    
                    // Universal B button to Leave/Unready/Title
                    if (curr.B && !pKeys.B) {
                        const player = players.find(p => p.inputId === i);
                        if (player && player.joined) {
                            if (player.ready) {
                                player.ready = false;
                                if (typeof playSound === 'function') playSound('blip');
                            } else {
                                player.joined = false;
                                player.inputId = -1;
                                if (typeof playSound === 'function') playSound('blip');
                            }
                            if (typeof updateLobbyUI === 'function') updateLobbyUI();
                        } else {
                            // If not joined, pressing B quits back to the main menu
                            changePhase('menu');
                            if (typeof playSound === 'function') playSound('blip');
                        }
                    }
                }
                prevRawKeys[i] = curr;
            }
        };
    }
}, 1000);
