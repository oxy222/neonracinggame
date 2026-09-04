// addons/powerup_neon.js - NEON POWER Special
// Grants a Star Power-style rainbow gradient, +10% speed over the max limit, and custom audio.

// 36-step smooth rainbow gradient to prevent harsh jumps
const rainbowHex = [
    '#ff0000', '#ff2b00', '#ff5500', '#ff8000', '#ffaa00', '#ffd500', 
    '#ffff00', '#d4ff00', '#aaff00', '#80ff00', '#55ff00', '#2bff00', 
    '#00ff00', '#00ff2b', '#00ff55', '#00ff80', '#00ffaa', '#00ffd5', 
    '#00ffff', '#00d4ff', '#00aaff', '#0080ff', '#0055ff', '#002bff', 
    '#0000ff', '#2b00ff', '#5500ff', '#8000ff', '#aa00ff', '#d400ff', 
    '#ff00ff', '#ff00d4', '#ff00aa', '#ff0080', '#ff0055', '#ff002b'
];

window.NeonGP.registerSpecial({
    id: 'neonpower',
    name: 'NEON POWER',
    color: '#ff00ff', // Base magenta indicator in UI
    chargeRate: 100 / 1500, // 25 seconds cooldown at 60fps (1500 frames)
    cost: 100, // Costs a full bar
    
    onUse: function(p, activePlayers) {
        // Activate the power state and set the 6-second timer (360 frames @ 60fps)
        p.specialState.neonActive = true;
        p.specialState.neonTimer = 300; 
        
        // Save their original lobby color so we can revert them later
        if (!p.specialState.originalColor) {
            p.specialState.originalColor = p.color;
        }
        
        p.specialState.colorIndex = 0;

        // Pre-warm the SVG image cache for all 36 colors to completely prevent flickering
        if (typeof getCarSVG === 'function') {
            rainbowHex.forEach(hex => getCarSVG(p.carModel, hex));
        }

        // Silence global background music tracks
        if (typeof raceMusic !== 'undefined') raceMusic.volume = 0;
        if (typeof menuMusic !== 'undefined') menuMusic.volume = 0;

        // Play the custom audio file and store reference to stop it abruptly
        if (p.specialState.neonAudio) {
            p.specialState.neonAudio.pause();
            p.specialState.neonAudio.currentTime = 0;
        }
        p.specialState.neonAudio = new Audio('audio/neonpower.mp3');
        p.specialState.neonAudio.volume = 0.8;
        p.specialState.neonAudio.play().catch(e => console.warn("Neon Power audio not found.", e));
    },
    
    onUpdate: function(p, activePlayers) {
        if (p.specialState.neonActive) {
            p.specialState.neonTimer--;
            
            // Revert back to normal when time expires
            if (p.specialState.neonTimer <= 0) {
                p.specialState.neonActive = false;
                p.color = p.specialState.originalColor;
                
                // Stop music abruptly
                if (p.specialState.neonAudio) {
                    p.specialState.neonAudio.pause();
                    p.specialState.neonAudio.currentTime = 0;
                }

                // Restore background music only if no one else is currently using Neon Power
                const anyoneElseActive = activePlayers.some(other => other.id !== p.id && other.specialState.neonActive);
                if (!anyoneElseActive) {
                    if (typeof raceMusic !== 'undefined') raceMusic.volume = 0.50;
                    if (typeof menuMusic !== 'undefined') menuMusic.volume = 0.95;
                }
                return;
            }

            // Shift through the rainbow every 2 frames for a smooth cycle
            // We only apply the color if the SVG image is fully parsed to prevent blank-frame flickering
            if (p.specialState.neonTimer % 2 === 0) {
                const nextIndex = (p.specialState.colorIndex + 1) % rainbowHex.length;
                
                let imageReady = true;
                if (typeof getCarSVG === 'function') {
                    const img = getCarSVG(p.carModel, rainbowHex[nextIndex]);
                    if (!img || !img.complete) imageReady = false;
                }

                if (imageReady) {
                    p.specialState.colorIndex = nextIndex;
                    p.color = rainbowHex[p.specialState.colorIndex];
                }
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
