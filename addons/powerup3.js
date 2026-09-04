// addons/powerup_neon.js - NEON POWER Special
// Grants a Star Power-style rainbow gradient, +10% speed over the max limit, and custom audio.

// Pre-defined rainbow hex values to prevent overwhelming the SVG cache
const rainbowHex = [
    '#ff0000', '#ff8000', '#ffff00', '#80ff00', 
    '#00ff00', '#00ff80', '#00ffff', '#0080ff', 
    '#0000ff', '#8000ff', '#ff00ff', '#ff0080'
];

window.NeonGP.registerSpecial({
    id: 'neonpower',
    name: 'NEON POWER',
    color: '#ff00ff', // Base magenta indicator in UI
    chargeRate: 100 / 1500, // 25 seconds cooldown at 60fps (1500 frames)
    cost: 100, // Costs a full bar
    
    onUse: function(p, activePlayers) {
        // Activate the power state and set the 7-second timer (420 frames)
        p.specialState.neonActive = true;
        p.specialState.neonTimer = 420; 
        
        // Save their original lobby color so we can revert them later
        if (!p.specialState.originalColor) {
            p.specialState.originalColor = p.color;
        }
        
        p.specialState.colorIndex = 0;

        // Play the custom audio file
        const neonAudio = new Audio('audio/neonpower.mp3');
        neonAudio.volume = 0.8;
        neonAudio.play().catch(e => console.warn("Neon Power audio not found.", e));
    },
    
    onUpdate: function(p, activePlayers) {
        if (p.specialState.neonActive) {
            p.specialState.neonTimer--;
            
            // Revert back to normal when time expires
            if (p.specialState.neonTimer <= 0) {
                p.specialState.neonActive = false;
                p.color = p.specialState.originalColor;
                return;
            }

            // Shift through the rainbow every 2 frames for a smooth but performant cycle
            if (p.specialState.neonTimer % 2 === 0) {
                p.specialState.colorIndex = (p.specialState.colorIndex + 1) % rainbowHex.length;
                p.color = rainbowHex[p.specialState.colorIndex];
            }

            // Add exactly 10% speed bypassing the normal engine clamp by translating positional coordinates
            // We multiply by the absolute speed so the boost only applies when moving
            p.x += Math.cos(p.angle) * (Math.abs(p.speed) * 0.10);
            p.y += Math.sin(p.angle) * (Math.abs(p.speed) * 0.10);

            // Persistent Boost Smoke tied dynamically to current shifting color
            if (typeof particles !== 'undefined') {
                for(let k = 0; k < 2; k++) {
                    particles.push({
                        x: p.x - Math.cos(p.angle) * 100, 
                        y: p.y - Math.sin(p.angle) * 100,
                        vx: -Math.cos(p.angle) * 30 + (Math.random() - 0.5) * 20,
                        vy: -Math.sin(p.angle) * 30 + (Math.random() - 0.5) * 20,
                        life: 1.0, 
                        color: p.color, // Automatically uses current rainbow gradient slice
                        size: Math.random() * 25 + 10
                    });
                }
            }
        }
    }
});
