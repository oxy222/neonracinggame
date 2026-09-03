// addons/powerup2.js - Glue Strip Trap Special

// Register the powerup with the global NeonGP system[cite: 1]
window.NeonGP.registerSpecial({
    id: 'gluestrip',
    name: 'GLUE STRIP',
    color: '#00ffcc', // Sticky cyan/green
    chargeRate: 100 / 900, // Charges in ~15 seconds at 60fps[cite: 1]
    cost: 100, // Costs a full bar to use[cite: 1]
    
    onUse: function(p, activePlayers) {
        // Initialize the glue strips tracking array on the player if it doesn't exist[cite: 1]
        if (!p.specialState.glueStrips) p.specialState.glueStrips = [];
        
        // Spawn behind the car by using a negative distance relative to the player's angle
        const spawnDist = -120; 
        
        p.specialState.glueStrips.push({
            x: p.x + Math.cos(p.angle) * spawnDist, //[cite: 1]
            y: p.y + Math.sin(p.angle) * spawnDist, //[cite: 1]
            life: 600, // 10 seconds of track presence (60fps * 10)
            active: true,
            splashTimer: 0 // Used for the splash animation when a racer hits it
        });
    },
    
    onUpdate: function(p, activePlayers) {
        if (!p.specialState.glueStrips) return; //[cite: 1]
        
        p.specialState.glueStrips.forEach(strip => {
            if (!strip.active && strip.splashTimer <= 0) return;
            
            if (strip.active) {
                strip.life--;
                // Expire if it sits on the track for too long without being hit
                if (strip.life <= 0) {
                    strip.active = false;
                    return;
                }
                
                // Check collisions with all other active racers[cite: 1]
                activePlayers.forEach(other => {
                    if (other.id !== p.id && !other.finished) { //[cite: 1]
                        const dist = Math.hypot(other.x - strip.x, other.y - strip.y); //[cite: 1]
                        
                        if (dist < 100) { // Hit radius of the puddle
                            strip.active = false; // Destroy the trap (one use)
                            
                            // Temporary slowdown: Cut speed by 80% and cancel their turbo[cite: 1]
                            other.speed *= 0.2; 
                            other.turboActive = false; //[cite: 1]
                            
                            // Trigger visual splash effect
                            strip.splashTimer = 20; 
                        }
                    }
                });
            }
        });
    },
    
    onDraw: function(ctx, p, activePlayers) {
        if (!p.specialState.glueStrips) return; //[cite: 1]
        
        p.specialState.glueStrips.forEach(strip => {
            
            // Handle Splash rendering when triggered by a collision
            if (!strip.active && strip.splashTimer > 0) {
                strip.splashTimer--;
                ctx.save(); //[cite: 1]
                ctx.translate(strip.x, strip.y); //[cite: 1]
                ctx.beginPath(); //[cite: 1]
                
                // Splatters outward and fades as timer counts down[cite: 1]
                const radius = (20 - strip.splashTimer) * 12;
                ctx.arc(0, 0, radius, 0, Math.PI * 2); //[cite: 1]
                ctx.fillStyle = `rgba(0, 255, 204, ${strip.splashTimer / 20})`;
                ctx.fill(); //[cite: 1]
                
                ctx.restore(); //[cite: 1]
                return;
            }
            
            // Stop drawing if totally inactive
            if (!strip.active) return;
            
            ctx.save(); //[cite: 1]
            ctx.translate(strip.x, strip.y); //[cite: 1]
            
            // Draw Sticky Puddle Core
            ctx.beginPath(); //[cite: 1]
            // Draw a wide ellipse so it stretches across the road lane
            ctx.ellipse(0, 0, 90, 45, 0, 0, Math.PI * 2); 
            ctx.fillStyle = `rgba(0, 255, 204, ${(strip.life / 600) * 0.8})`; // Fades out slowly as it expires
            ctx.shadowBlur = 20; //[cite: 1]
            ctx.shadowColor = '#00ffcc'; //[cite: 1]
            ctx.fill(); //[cite: 1]
            
            // Draw bright shiny center
            ctx.beginPath(); //[cite: 1]
            ctx.ellipse(0, 0, 40, 15, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${(strip.life / 600) * 0.4})`;
            ctx.shadowBlur = 0; //[cite: 1]
            ctx.fill(); //[cite: 1]
            
            ctx.restore(); //[cite: 1]
        });
        
        // Garbage collect dead strips that have finished splashing[cite: 1]
        p.specialState.glueStrips = p.specialState.glueStrips.filter(strip => strip.active || strip.splashTimer > 0);
    }
});
