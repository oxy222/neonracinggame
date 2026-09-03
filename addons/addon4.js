// addons/addon4.js - Car Color Picker
// Select your car's neon color scheme using the Gamepad Bumpers (LB/RB) directly on the vehicle slot.

const neonPalette = [
    '#e60012', // P1 Red
    '#00c3e3', // P2 Blue
    '#bbff00', // P3 Lime
    '#ffaa00', // P4 Orange
    '#b200ff', // Purple
    '#ff00aa', // Pink
    '#ffffff', // White
    '#ffff00', // Yellow
    '#00ffaa'  // Mint
];

const bumperStates = Array(6).fill().map(() => ({ lb: false, rb: false }));

const initColorUI = () => {
    // Dynamically insert bumper hints directly into the car display area
    players.forEach((p, i) => {
        const slot = document.getElementById(`slot-${i}`);
        if (slot) {
            const carDisplay = slot.querySelector('.car-display');
            if (carDisplay && !document.getElementById(`color-lb-${i}`)) {
                const lb = document.createElement('div');
                lb.id = `color-lb-${i}`;
                lb.innerHTML = 'LB';
                lb.style.cssText = 'position:absolute; top: 10px; left: 10px; font-weight:900; color:#aaa; font-size:1.2rem; transition: opacity 0.2s;';
                
                const rb = document.createElement('div');
                rb.id = `color-rb-${i}`;
                rb.innerHTML = 'RB';
                rb.style.cssText = 'position:absolute; top: 10px; right: 10px; font-weight:900; color:#aaa; font-size:1.2rem; transition: opacity 0.2s;';
                
                carDisplay.appendChild(lb);
                carDisplay.appendChild(rb);
            }
        }
    });
    
    // Append Bumper controls reference to the main controls hint box
    const controls = document.querySelector('.controls-box');
    if (controls && !controls.innerHTML.includes('CAR COLOR')) {
        const hintDiv = document.createElement('div');
        hintDiv.style.marginBottom = '10px';
        hintDiv.innerHTML = `<span class="btn-prompt btn-start" style="border-radius:4px;">LB / RB</span> <span>CAR COLOR</span> &nbsp;&nbsp;&nbsp; <span style="font-size:0.8rem; color:#888;">(KB1: Q/E | KB2: U/O)</span>`;
        
        if (controls.children.length >= 2) {
            controls.insertBefore(hintDiv, controls.children[2]);
        } else {
            controls.appendChild(hintDiv);
        }
    }
};

const changePlayerColor = (inputId, direction) => {
    const p = players.find(x => x.inputId === inputId);
    
    if (!p || !p.joined || p.ready || gameState.phase !== 'lobby') return;
    
    let currentIndex = neonPalette.indexOf(p.color);
    if (currentIndex === -1) currentIndex = 0;
    
    currentIndex = (currentIndex + direction + neonPalette.length) % neonPalette.length;
    p.color = neonPalette[currentIndex];
    
    // Update the car image immediately in the DOM for responsive feedback
    const img = document.getElementById(`img-slot-${p.id}`);
    if (img) img.src = getCarSVG(p.carModel, p.color).src;
    
    // Update CSS variables for the border glowing effect
    const slot = document.getElementById(`slot-${p.id}`);
    if (slot) slot.style.setProperty('--p-color', p.color);
    
    if (typeof playSound === 'function') playSound('blip');
};

setTimeout(() => {
    initColorUI();
    
    // Dim bumper hints when ready or unjoined
    if (typeof updateLobbyUI === 'function') {
        const originalUpdateLobby = updateLobbyUI;
        updateLobbyUI = function() {
            originalUpdateLobby(); 
            players.forEach((p, i) => {
                const lb = document.getElementById(`color-lb-${i}`);
                const rb = document.getElementById(`color-rb-${i}`);
                if (lb && rb) {
                    const opacity = (p.joined && !p.ready) ? '1' : '0.1';
                    lb.style.opacity = opacity;
                    rb.style.opacity = opacity;
                }
            });
        };
    }

    // Intercept native input polling to read gamepads/keys for color toggles
    if (typeof pollInput === 'function') {
        const originalPollInput = pollInput;
        pollInput = function() {
            originalPollInput(); 
            
            if (gameState.phase !== 'lobby') return; 
            
            const gps = navigator.getGamepads ? navigator.getGamepads() : [];
            for (let i = 0; i < 6; i++) {
                let lbPressed = false;
                let rbPressed = false;
                
                if (i === 0) { // Keyboard 1 Check (Q/E)
                    lbPressed = !!keys['KeyQ'];
                    rbPressed = !!keys['KeyE'];
                } else if (i === 1) { // Keyboard 2 Check (U/O)
                    lbPressed = !!keys['KeyU'];
                    rbPressed = !!keys['KeyO'];
                } else if (i >= 2) { // Gamepads Check
                    const pad = gps[i - 2];
                    if (pad) {
                        lbPressed = pad.buttons[4]?.pressed;
                        rbPressed = pad.buttons[5]?.pressed;
                    }
                }
                
                if (lbPressed && !bumperStates[i].lb) changePlayerColor(i, -1);
                if (rbPressed && !bumperStates[i].rb) changePlayerColor(i, 1);
                
                bumperStates[i].lb = lbPressed;
                bumperStates[i].rb = rbPressed;
            }
        };
    }
}, 600);
