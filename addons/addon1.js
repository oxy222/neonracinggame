// addons/addon1.js - Fullscreen Map Toggle Addon

// Setup global state for the addon
window.NeonGP.fullscreenMap = false;

// 1. Inject the UI hint into the lobby screen
const initFullscreenAddon = () => {
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
        toggleDiv.innerHTML = `CAMERA MODE: <span id="fs-status" style="color:var(--switch-red);">DYNAMIC PAN</span> (Press <span class="btn-prompt btn-start">M</span> to toggle)`;
        controlsBox.appendChild(toggleDiv);
    }
};

// Wait for DOM in case the script loads instantly
document.addEventListener('DOMContentLoaded', initFullscreenAddon);
setTimeout(initFullscreenAddon, 1000); // Fallback execution

// 2. Listen for the 'M' key to toggle the state
window.addEventListener('keydown', (e) => {
    // Only toggle if we are currently in the lobby
    if (e.key.toLowerCase() === 'm' && typeof gameState !== 'undefined' && gameState.phase === 'lobby') {
        window.NeonGP.fullscreenMap = !window.NeonGP.fullscreenMap;
        
        // Update UI
        const statusSpan = document.getElementById('fs-status');
        if (statusSpan) {
            if (window.NeonGP.fullscreenMap) {
                statusSpan.innerText = 'FULL MAP VIEW';
                statusSpan.style.color = '#00ff00';
            } else {
                statusSpan.innerText = 'DYNAMIC PAN';
                statusSpan.style.color = 'var(--switch-red)';
            }
        }
        
        // Optional: Play the game's menu blip if AudioContext exists
        if (typeof playSound === 'function') playSound('blip');
    }
});

// 3. Intercept and override the game's native camera function
setTimeout(() => {
    if (typeof updateCamera === 'function') {
        // Cache the original camera logic
        const originalUpdateCamera = updateCamera;
        
        // Overwrite the global function
        updateCamera = function() {
            if (window.NeonGP.fullscreenMap && currentTrack && currentTrack.spline) {
                // Find absolute bounds of the current procedural track
                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                
                currentTrack.spline.forEach(pt => {
                    if (pt.x < minX) minX = pt.x;
                    if (pt.x > maxX) maxX = pt.x;
                    if (pt.y < minY) minY = pt.y;
                    if (pt.y > maxY) maxY = pt.y;
                });
                
                const trackWidth = maxX - minX;
                const trackHeight = maxY - minY;
                const midX = (maxX + minX) / 2;
                const midY = (maxY + minY) / 2;
                
                // Add padding so the track isn't touching the literal edge of the screen
                const padding = 2500; 
                
                // Calculate the exact scale required to fit the track inside the window
                const scaleX = windowWidth / (trackWidth + padding);
                const scaleY = windowHeight / (trackHeight + padding);
                
                // Use the smallest scale to ensure both width and height fit
                const targetScale = Math.min(scaleX, scaleY);
                
                // Smoothly pan camera to true center
                gameState.camera.x += (midX - gameState.camera.x) * 0.1;
                gameState.camera.y += (midY - gameState.camera.y) * 0.1;
                
                // Smoothly zoom out to target scale
                gameState.camera.scale += (targetScale - gameState.camera.scale) * 0.05;
            } else {
                // If toggled off, run standard Dynamic Action Camera
                originalUpdateCamera();
            }
        };
    }
}, 500); // 500ms delay ensures the main game script has fully evaluated first
