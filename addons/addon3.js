// addons/addon3.js - CC Toggle Fix and Base Speed Enhancer
// Re-maps the CC toggle to function perfectly and supercharges the base speeds for each class.

// Define hidden multiplier values that make the physics engine feel much faster
const ccMultipliers = {
    50: 75,   // 50cc feels like 75
    100: 140, // 100cc feels like 140
    150: 220  // 150cc feels like 220
};

// Apply immediate speed boost to default 100cc state on load
if (window.NeonGP && window.NeonGP.ccMode === 100) {
    window.NeonGP.ccMode = ccMultipliers[100];
}

setTimeout(() => {
    if (typeof handleUIEvent === 'function') {
        // Cache original UI event processor
        const originalHandleUI = handleUIEvent;
        
        handleUIEvent = function(inputId, actionType) {
            // Intercept the 'Y' button (ccToggle) action specifically in the lobby
            if (gameState.phase === 'lobby' && actionType === 'ccToggle') {
                const displayModes = [50, 100, 150];
                
                // Deduce current display mode from internal hidden multiplier
                let currentDisplay = 100;
                if (window.NeonGP.ccMode === ccMultipliers[50] || window.NeonGP.ccMode === 50) currentDisplay = 50;
                if (window.NeonGP.ccMode === ccMultipliers[100] || window.NeonGP.ccMode === 100) currentDisplay = 100;
                if (window.NeonGP.ccMode === ccMultipliers[150] || window.NeonGP.ccMode === 150) currentDisplay = 150;
                
                // Cycle index safely to the next mode
                const nextIdx = (displayModes.indexOf(currentDisplay) + 1) % 3;
                const nextDisplay = displayModes[nextIdx];
                
                // Apply the newly boosted hidden multiplier to the physics engine
                window.NeonGP.ccMode = ccMultipliers[nextDisplay];
                
                if (typeof playSound === 'function') playSound('blip');
                
                // Ensure UI display stays normal despite backend boosts
                const ccElement = document.getElementById('cc-display');
                if (ccElement) ccElement.innerText = nextDisplay + "CC";
                
                // Halt execution so the original function doesn't double-fire
                return;
            }
            
            // Let all other inputs (menus, ready up, etc.) pass through normally
            originalHandleUI(inputId, actionType);
        };
    }
}, 500);
