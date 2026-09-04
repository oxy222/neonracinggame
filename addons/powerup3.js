// addons/neonpower.js - Neon Power Star Special

window.NeonGP.registerSpecial({
    id: 'neonpower',
    name: 'NEON POWER',
    color: '#ff00ff', // Magenta 
    chargeRate: 100 / 900, 
    cost: 100, 
    
    onUse: function(p, activePlayers) {
        // Initialize neon state tracking if it doesn't exist
        if (!p.specialState.neonData) {
            p.specialState.neonData = { lastLapUsed: -1, timer: 0 };
        }
        
        // Enforce the once-per-lap limitation
        if (p.specialState.neonData.lastLapUsed === p.lap) {
            // Refund the charge if the base system immediately consumed it upon activation
            p.specialEnergy = Math.min(100, (p.specialEnergy || 0) + 100);
            return;
        }
        
        // Log the current lap and set the timer for 15 seconds (900 frames at 60fps)
        p.specialState.neonData.lastLapUsed = p.lap;
        p.specialState.neonData.timer = 600; 
        
        // Trigger the music
        const neonAudio = new Audio('/audio/neonpower.mp3');
        neonAudio.play().catch(e => console.warn('Audio play restricted by browser:', e));
    },
    
    onUpdate: function(p, activePlayers) {
        if (!p.specialState.neonData) return;
        
        if (p.specialState.neonData.timer > 0) {
            p.specialState.neonData.timer--;
            
            // Constantly refill standard boost reserves so it can be spammed
            p.turboEnergy = 100; // Common turbo var name
            p.boostAmount = 100; // Common boost var name
            
            // If the timer just expired, disable any active forced states to return to normal
            if (p.specialState.neonData.timer === 0) {
                p.turboActive = false; 
            }
        }
    },
    
    onDraw: function(ctx, p, activePlayers) {
        if (!p.specialState.neonData || p.specialState.neonData.timer <= 0) return;
        
        ctx.save(); 
        ctx.translate(p.x, p.y); 
        
        // Calculate dynamic rainbow colors based on current time
        const time = Date.now();
        const hue = (time / 5) % 360; 
        
        // Draw the pulsing rainbow aura around the car
        ctx.beginPath(); 
        
        // Create a slight pulse effect by applying a sine wave to the radius
        const pulse = Math.sin(time / 100) * 10;
        ctx.ellipse(0, 0, 70 + pulse, 40 + pulse, p.angle, 0, Math.PI * 2); 
        
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
        ctx.lineWidth = 8;
        ctx.shadowBlur = 25; 
        ctx.shadowColor = `hsl(${hue}, 100%, 50%)`; 
        ctx.stroke(); 
        
        // Softly illuminate the core of the aura underneath the car
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.15)`;
        ctx.fill(); 
        
        ctx.restore(); 
    }
});
