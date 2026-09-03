// addons/addon8.js - Race Settings & Secret Stickman Racer
// Adds Race Count (1,3,6) and a Konami Code Stickman unlock.

window.NeonGP = window.NeonGP || {};
window.NeonGP.raceCount = 3;

// Global renderer for the stickman (exposed so other rendering mods can respect it)
window.drawStickman = function(p) {
    if (typeof ctx === 'undefined') return;
    ctx.save();
    ctx.translate(p.x, p.y);
    
    // Base Player ID Ring (Matches other cars)
    ctx.beginPath(); ctx.arc(0, 0, 110, 0, Math.PI*2);
    ctx.strokeStyle = p.color; ctx.lineWidth = 10;
    ctx.shadowBlur = 35; ctx.shadowColor = p.color; ctx.stroke();

    ctx.fillStyle = p.color; ctx.font = '900 40px "Montserrat"';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowBlur = 0;
    ctx.fillText(`P${p.id+1}`, 0, -240);

    // Orientation: Always upright, flip horizontally if moving left, and scale up for huge maps
    const isMovingLeft = Math.cos(p.angle) < 0;
    ctx.scale(isMovingLeft ? -2.5 : 2.5, 2.5);

    // Frantic Animation based on speed
    const speedRatio = Math.abs(p.speed) / 28; 
    let t = 0;
    if (speedRatio > 0.05) t = Date.now() * 0.02 * Math.max(0.5, speedRatio);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.shadowBlur = 10; ctx.shadowColor = p.color;

    ctx.beginPath();
    // Torso
    ctx.moveTo(0, -15); ctx.lineTo(0, 10); 
    // Legs
    ctx.moveTo(0, 10); ctx.lineTo(Math.sin(t)*15, 10 + Math.abs(Math.cos(t))*15 + 10);
    ctx.moveTo(0, 10); ctx.lineTo(Math.sin(t+Math.PI)*15, 10 + Math.abs(Math.cos(t+Math.PI))*15 + 10);
    // Arms
    ctx.moveTo(0, -5); ctx.lineTo(Math.sin(t+Math.PI)*15, Math.abs(Math.cos(t+Math.PI))*10 - 5);
    ctx.moveTo(0, -5); ctx.lineTo(Math.sin(t)*15, Math.abs(Math.cos(t))*10 - 5);
    ctx.stroke();

    // Head
    ctx.beginPath(); ctx.arc(0, -22, 7, 0, Math.PI*2);
    ctx.fillStyle = '#111'; ctx.fill(); ctx.stroke();

    ctx.restore();
};

// Hook UI elements and progression safely
setTimeout(() => {
    // 1. UI injection for Lobby
    const originalUpdateLobby = typeof updateLobbyUI === 'function' ? updateLobbyUI : null;
    if (originalUpdateLobby) {
        window.updateLobbyUI = function() {
            originalUpdateLobby();
            const lobby = document.getElementById('screen-lobby');
            if (lobby && !document.getElementById('race-count-ui')) {
                const rcDiv = document.createElement('div');
                rcDiv.id = 'race-count-ui';
                rcDiv.innerHTML = `GRAND PRIX: <span id="rc-val" style="color:#0ff;">3 RACES</span> <span style="font-size:0.5em; color:#888;">(Press X to cycle)</span>`;
                rcDiv.style.cssText = 'font-size: 1.5rem; margin-bottom: 20px; text-align: center; text-shadow: 0 0 10px #0ff; font-family:"Press Start 2P", monospace;';
                lobby.insertBefore(rcDiv, lobby.querySelector('.lobby-container'));
            }
        };
    }

    // 2. Progression intercept (Loops tracks seamlessly)
    if (typeof checkStandingsStart === 'function') {
        window.checkStandingsStart = function() {
            const active = players.filter(p => p.joined);
            if (active.every(p => p.ready)) {
                gameState.currentTrackIdx++;
                // If we've completed the requested number of races, go to podium
                if (gameState.currentTrackIdx >= window.NeonGP.raceCount) {
                    changePhase('podium');
                } else {
                    // Loop tracks if playing a long Grand Prix
                    if (gameState.currentTrackIdx >= gameState.trackOrder.length) {
                        gameState.currentTrackIdx = 0; 
                    }
                    startRaceSetup();
                }
            }
        };
    }
    
    // 3. Force the Main Renderer to acknowledge our Addon Stickman
    if (typeof drawSpriteCar === 'function') {
        const origDraw = drawSpriteCar;
        window.drawSpriteCar = function(p) {
            if (p.isStickman && typeof window.drawStickman === 'function') {
                return window.drawStickman(p);
            }
            origDraw(p);
        }
    }
}, 1000);

// Dedicated input polling for Konami code & Race Count
const KONAMI_CODE = ['U','U','D','D','L','R','L','R','B','A','SEL'];
let seq = Array(6).fill().map(() => []);
let pState = Array(6).fill().map(() => ({}));

const loop8 = () => {
    if (typeof gameState === 'undefined') return requestAnimationFrame(loop8);
    const gps = navigator.getGamepads ? navigator.getGamepads() : [];
    
    for (let i = 0; i < 6; i++) {
        let c = {};
        // Read raw states for Konami
        if (i===0 && typeof keys !== 'undefined') { c.U=!!keys['KeyW']; c.D=!!keys['KeyS']; c.L=!!keys['KeyA']; c.R=!!keys['KeyD']; c.B=!!keys['Backspace']; c.A=!!keys['Space']; c.X=!!keys['KeyE'] || !!keys['KeyX']; c.SEL=!!keys['Escape']||!!keys['Tab']; }
        else if (i===1 && typeof keys !== 'undefined') { c.U=!!keys['ArrowUp']; c.D=!!keys['ArrowDown']; c.L=!!keys['ArrowLeft']; c.R=!!keys['ArrowRight']; c.B=!!keys['Backspace']; c.A=!!keys['Enter']; c.X=!!keys['Slash']; c.SEL=!!keys['Backslash']; }
        else {
            const pad = gps[i-2];
            if (pad) {
                c.U = pad.buttons[12]?.pressed || pad.axes[1] < -0.5;
                c.D = pad.buttons[13]?.pressed || pad.axes[1] > 0.5;
                c.L = pad.buttons[14]?.pressed || pad.axes[0] < -0.5;
                c.R = pad.buttons[15]?.pressed || pad.axes[0] > 0.5;
                c.B = pad.buttons[1]?.pressed; c.A = pad.buttons[0]?.pressed; c.X = pad.buttons[2]?.pressed;
                c.SEL = pad.buttons[8]?.pressed; // Select / View button
            }
        }
        
        // Edge detection for sequences
        ['U','D','L','R','B','A','SEL'].forEach(k => {
            if (c[k] && !pState[i][k]) {
                seq[i].push(k);
                if (seq[i].length > 11) seq[i].shift();
                
                // Check for successful sequence
                if (seq[i].join(',') === KONAMI_CODE.join(',')) {
                    const p = players.find(x => x.inputId === i);
                    if (p && gameState.phase === 'racing') {
                        p.isStickman = true;
                        if (typeof playSound === 'function') playSound('ready');
                        seq[i] = []; 
                    }
                }
            }
        });

        // Setup Screen Modifiers
        if (gameState.phase === 'lobby') {
            const p = players.find(x => x.inputId === i);
            if (c.X && !pState[i].X) { 
                // Toggle Race Count
                window.NeonGP.raceCount = window.NeonGP.raceCount === 1 ? 3 : (window.NeonGP.raceCount === 3 ? 6 : 1);
                const rcVal = document.getElementById('rc-val');
                if (rcVal) {
                    rcVal.innerText = window.NeonGP.raceCount === 1 ? '1 RACE' : `${window.NeonGP.raceCount} RACES`;
                    rcVal.style.color = window.NeonGP.raceCount === 6 ? '#f0f' : '#0ff';
                }
                if (typeof playSound === 'function') playSound('blip');
            }
        }
        pState[i] = c;
    }
    requestAnimationFrame(loop8);
};
loop8();
