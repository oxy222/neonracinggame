// addons/addon2.js - Single Player Zoom Fix
// Intercepts the dynamic camera logic to provide a much wider FOV when only one player is racing.

setTimeout(() => {
    if (typeof updateCamera === 'function') {
        // Cache the original camera function from the base game
        const originalCameraLogic = updateCamera;
        
        updateCamera = function() {
            // Determine how many players are currently active and racing
            const targets = players.filter(p => p.joined && (!p.finished || gameState.finishers === players.filter(x=>x.joined).length));
            
            // If it's a solo race (and we aren't using the fullscreen map addon)
            if (targets.length === 1 && (!window.NeonGP || !window.NeonGP.fullscreenMap)) {
                const p = targets[0];
                
                // Smoothly pan camera to center precisely on the single player
                gameState.camera.x += (p.x - gameState.camera.x) * 0.1;
                gameState.camera.y += (p.y - gameState.camera.y) * 0.1;
                
                // Use a significantly zoomed-out fixed scale so the player can see upcoming turns
                // The default multiplayer formula caused the camera to be ~1.0 scale (way too close). 
                // We lock it to 0.3 for an excellent wide-angle view at high speeds.
                const singlePlayerScale = 0.3;
                gameState.camera.scale += (singlePlayerScale - gameState.camera.scale) * 0.05;
            } else {
                // Otherwise, fallback to the standard multiplayer dynamic camera
                originalCameraLogic();
            }
        };
    }
}, 500); // 500ms delay ensures the main game scripts evaluate first
