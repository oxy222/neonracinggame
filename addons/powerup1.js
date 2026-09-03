// addons/powerup1.js - Fireball Projectile Special

// Register the powerup with the global NeonGP system
window.NeonGP.registerSpecial({
    id: 'fireball',
    name: 'FIREBALL',
    color: '#ff4400', // Fiery orange
    chargeRate: 100 / 900, // Charges in ~15 seconds at 60fps
    cost: 100, // Costs a full bar to use
    
    onUse: function(p, activePlayers) {
        // Initialize the fireball tracking array on the player if it doesn't exist
        if (!p.specialState.fireballs) p.specialState.fireballs = [];
        
        // Spawn slightly ahead of the car to avoid hitting ourselves immediately
        const spawnDist = 180; 
        
        p.specialState.fireballs.push({
            x: p.x + Math.cos(p.angle) * spawnDist,
            y: p.y + Math.sin(p.angle) * spawnDist,
            vx: Math.cos(p.angle) * 75, // Extremely fast velocity
            vy: Math.sin(p.angle) * 75,
            life: 120, // 2 seconds of flight time (approx 75 * 120 distance)
            active: true,
            explosionTimer: 0,
            trail: []
        });
    },
    
    onUpdate: function(p, activePlayers) {
        if (!p.specialState.fireballs) return;
        
        p.specialState.fireballs.forEach(fb => {
            if (!fb.active) return;
            
            fb.life--;
            if (fb.life <= 0) {
                fb.active = false;
                return;
            }
            
            // Track previous positions for the trail effect
            fb.trail.push({x: fb.x, y: fb.y});
            if (fb.trail.length > 8) fb.trail.shift(); // Keep trail short and snappy
            
            // Move fireball
            fb.x += fb.vx;
            fb.y += fb.vy;
            
            // Check collisions with all other active racers
            activePlayers.forEach(other => {
                if (other.id !== p.id && !other.finished) {
                    const dist = Math.hypot(other.x - fb.x, other.y - fb.y);
                    if (dist < 150) { // Large hit radius
                        fb.active = false; // Destroy projectile
                        
                        // Devastating impact: stop target dead and cancel their turbo
                        other.speed = 0; 
                        other.turboActive = false; 
                        
                        // Trigger visual explosion
                        fb.explosionTimer = 25; 
                    }
                }
            });
        });
    },
    
    onDraw: function(ctx, p, activePlayers) {
        if (!p.specialState.fireballs) return;
        
        // Because the base game sets ctx.translate() relative to the camera,
        // we can draw world-coordinates directly!
        p.specialState.fireballs.forEach(fb => {
            
            // Handle Explosion rendering
            if (!fb.active && fb.explosionTimer > 0) {
                fb.explosionTimer--;
                ctx.save();
                ctx.translate(fb.x, fb.y);
                ctx.beginPath();
                // Expands outward and fades as timer counts down
                const radius = (25 - fb.explosionTimer) * 15;
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, ${fb.explosionTimer * 8}, 0, ${fb.explosionTimer / 25})`;
                ctx.fill();
                
                // Inner bright core of explosion
                ctx.beginPath();
                ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${fb.explosionTimer / 25})`;
                ctx.fill();
                ctx.restore();
                return;
            }
            
            // Stop drawing if totally inactive
            if (!fb.active) return;
            
            ctx.save();
            ctx.translate(fb.x, fb.y);
            
            // Draw Fiery Trail
            if (fb.trail.length > 0) {
                ctx.beginPath();
                ctx.moveTo(fb.trail[0].x - fb.x, fb.trail[0].y - fb.y);
                for (let i = 1; i < fb.trail.length; i++) {
                    ctx.lineTo(fb.trail[i].x - fb.x, fb.trail[i].y - fb.y);
                }
                ctx.strokeStyle = '#ffaa00';
                ctx.lineWidth = 30;
                ctx.lineCap = 'round';
                ctx.globalAlpha = 0.4;
                ctx.stroke();
            }
            
            // Draw Fireball Core
            ctx.beginPath();
            ctx.arc(0, 0, 40, 0, Math.PI * 2);
            ctx.fillStyle = '#ff4400';
            ctx.shadowBlur = 40;
            ctx.shadowColor = '#ff0000';
            ctx.fill();
            
            // Draw White Hot Center
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 0;
            ctx.fill();
            
            ctx.restore();
        });
        
        // Garbage collect dead fireballs that have finished exploding
        p.specialState.fireballs = p.specialState.fireballs.filter(fb => fb.active || fb.explosionTimer > 0);
    }
});
