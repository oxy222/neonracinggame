// addons/neonpower.js - Neon Power Star Special

// Helper function to turn dynamic HSL color phases into Hex codes for the SVG cache
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

window.NeonGP.registerSpecial({
    id: 'neonpower',
    name: 'NEON POWER',
    color: '#ff00ff', // Magenta icon
    chargeRate: 100 / 900, 
    cost: 100, 
    
    onUse: function(p, activePlayers) {
        // Initialize state tracking 
        if (!p.specialState.neonData) {
            p.specialState.neonData = { 
                lastLapUsed: -1, 
                timer: 0,
                originalColor: p.color 
            };
        }
        
        // Enforce once-per-lap limit
        if (p.specialState.neonData.lastLapUsed === p.lap) {
            // Refund the energy if they try to spam it on the same lap
            p.specialEnergy = Math.min(100, (p.specialEnergy || 0) + 100);
            return;
        }
        
        p.specialState.neonData.lastLapUsed = p.lap;
        p.specialState.neonData.timer = 900; // 15 seconds at 60fps
        p.specialState.neonData.originalColor = p.color; // Save their chosen lobby color
        
        const neonAudio = new Audio('/audio/neonpower.mp3');
        neonAudio.play().catch(e => console.warn('Audio play restricted by browser:', e));
    },
    
    onUpdate: function(p, activePlayers) {
        if (!p.specialState.neonData) return;
        
        if (p.specialState.neonData.timer > 0) {
            p.specialState.neonData.timer--;
            
            // Constantly refill boost so they can chain turbo endlessly
            p.turboEnergy = 100; 
            p.boostAmount = 100; 
            
            // Alter the physical car model's color directly in a rainbow loop
            // We step by 15 degrees to minimize the number of SVGs the engine needs to cache
            const time = Date.now();
            const hue = Math.floor(((time / 20) % 360) / 15) * 15;
            p.color = hslToHex(hue, 100, 50);
            
            // Cleanup and restore when finished
            if (p.specialState.neonData.timer === 0) {
                p.turboActive = false; 
                p.color = p.specialState.neonData.originalColor; // Snap back to normal
            }
        }
    },
    
    onDraw: function(ctx, p, activePlayers) {
        // The user specifically requested NO underglow/aura.
        // We leave onDraw completely empty, because altering p.color in onUpdate
        // natively forces the game engine to re-render the car model itself in rainbow hues!
    }
});
