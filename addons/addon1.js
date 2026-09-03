// addons/addon1.js - Arcade Camera Toggle Addon

// Setup global state for the addon (false = native panning, true = arcade fit)
window.NeonGP.arcadeCamera = false;

// 1. Inject the UI hint into the lobby screen
const initCameraAddon = () => {
    const controlsBox = document.querySelector('.controls-box');
    if (controlsBox && !document.getElementById('fs-toggle')) {
        const toggleDiv = document.createElement('div');
        toggleDiv.id = 'fs-toggle';
        toggleDiv.style.marginTop = '20px';
        toggleDiv.style.paddingTop = '10px';
        toggleDiv.style.borderTop = '1px solid #444';
        toggleDiv.style.color = '#fff';
        toggleDiv.style.fontSize = '1.1rem';
        toggleDiv.style.fontWeight = '900';
        toggleDiv.innerHTML = `CAMERA: <span id="fs-status" style="color:var(--switch-red);">DYNAMIC PAN</span> (Press <span class="btn-prompt btn-start">SELECT/VIEW</span> to toggle)`;
        controlsBox.appendChild(toggleDiv);
    }
};

document.addEventListener('DOMContentLoaded', initCameraAddon);
setTimeout(initCameraAddon, 1000); 

// Global boolean state to prevent spamming from held buttons
let prevSelectState = false; 

// 2. Intercept native input polling to read the Select/View button natively
setTimeout(() => {
    if (typeof pollInput === 'function') {
        const originalPollInput = pollInput;
        pollInput = function() {
            // Run native game polling
            originalPollInput(); 
            
            // Only allow toggle during Lobby phase
            if (typeof gameState !== 'undefined' && gameState.phase === 'lobby') {
                const gps = navigator.getGamepads ? navigator.getGamepads() : [];
                let selectPressed = false;
                
                // Check all active gamepads for the Select/View button (Index 8)
                for (let i = 0; i < 4; i++) {
                    const pad = gps[i];
                    if (pad && pad.buttons[8]?.pressed) {
                        selectPressed = true;
                        break;
                    }
                }
                
                // Standard edge-detection toggle logic
                if (selectPressed && !prevSelectState) {
                    window.NeonGP.arcadeCamera = !window.NeonGP.arcadeCamera;
                    
                    const statusSpan = document.getElementById('fs-status');
                    if (statusSpan) {
                        if (window.NeonGP.arcadeCamera) {
                            statusSpan.innerText = 'ARCADE FIT';
                            statusSpan.style.color = '#00ff00';
                        } else {
                            statusSpan.innerText = 'DYNAMIC PAN';
                            statusSpan.style.color = 'var(--switch-red)';
                        }
                    }
                    if (typeof playSound === 'function') playSound('blip');
                }
                prevSelectState = selectPressed;
            }
        };
    }

    // 3. Overwrite the global game camera logic to implement the framing
    if (typeof updateCamera === 'function') {
        const originalUpdateCamera = updateCamera;
        
        updateCamera = function() {
            if (window.NeonGP.arcadeCamera && typeof players !== 'undefined') {
                // Find all active, unfinished racers
                const targets = players.filter(p => p.joined && (!p.finished || gameState.finishers === players.filter(x=>x.joined).length));
                
                if (targets.length === 0) return;

                // Calculate the bounding box (Min and Max X/Y coordinates) containing all active players
                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                targets.forEach(p => {
                    if (p.x < minX) minX = p.x;
                    if (p.x > maxX) maxX = p.x;
                    if (p.y < minY) minY = p.y;
                    if (p.y > maxY) maxY = p.y;
                });

                // Calculate center point of the bounding box
                const midX = (maxX + minX) / 2;
                const midY = (maxY + minY) / 2;
                
                // Smoothly pan camera to true center of action
                gameState.camera.x += (midX - gameState.camera.x) * 0.1;
                gameState.camera.y += (midY - gameState.camera.y) * 0.1;
                
                // Dimensions of the current group of players
                const boxWidth = maxX - minX;
                const boxHeight = maxY - minY;

                // Add padding so players aren't literally touching the screen edge
                const padding = 1500; 

                // Calculate required scale based on the window size to perfectly fit everyone
                const scaleX = windowWidth / (boxWidth + padding);
                const scaleY = windowHeight / (boxHeight + padding);
                
                // Use the smallest scale to ensure both width and height fit, clamp to a maximum zoom so it doesn't get nauseatingly close if they stack up
                let targetScale = Math.min(scaleX, scaleY);
                if (targetScale > 0.6) targetScale = 0.6; 
                if (targetScale < 0.05) targetScale = 0.05; // Prevent breaking the rendering if they get incredibly far apart
                
                // Smooth zoom
                gameState.camera.scale += (targetScale - gameState.camera.scale) * 0.05;

            } else {
                // Toggled off: Standard Dynamic Action Camera from the base game
                originalUpdateCamera();
            }
        };
    }
}, 600); // 600ms delay ensures the main game script evaluates first
