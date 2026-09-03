// addons/addon14.js - Procedural Shader Pipeline
setTimeout(() => {
    let animClock = 0;

    const DLCRenderer = {
        renderRainbowRoad(ctx, track) {
            animClock += 0.02;
            const spline = track.spline; const w = track.width;
            
            ctx.lineWidth = w + 1000; ctx.strokeStyle = 'rgba(10, 0, 25, 0.8)';
            ctx.beginPath(); ctx.moveTo(spline[0].x, spline[0].y);
            for (let i = 1; i < spline.length; i++) ctx.lineTo(spline[i].x, spline[i].y);
            ctx.closePath(); ctx.stroke();

            const colors = ['#ff0033', '#ff9900', '#ffff00', '#33ff00', '#00ffff', '#9900ff'];
            const laneWidth = w / colors.length;

            colors.forEach((col, idx) => {
                const offset = -w / 2 + laneWidth * (idx + 0.5);
                ctx.lineWidth = laneWidth + 4; ctx.strokeStyle = col;
                ctx.beginPath();
                for (let i = 0; i < spline.length; i++) {
                    ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x + spline[i].nx * offset, spline[i].y + spline[i].ny * offset);
                }
                ctx.closePath(); ctx.stroke();
            });
        },
        renderHustleHighway(ctx, track) {
            animClock += 0.8;
            const spline = track.spline; const w = track.width;

            ctx.lineWidth = w + 450; ctx.strokeStyle = '#1e2029';
            ctx.beginPath(); ctx.moveTo(spline[0].x, spline[0].y);
            for (let i = 1; i < spline.length; i++) ctx.lineTo(spline[i].x, spline[i].y);
            ctx.closePath(); ctx.stroke();

            ctx.lineWidth = w; ctx.strokeStyle = '#0e1014'; ctx.stroke();

            ctx.save();
            ctx.lineWidth = 12; ctx.strokeStyle = '#00f0ff'; ctx.setLineDash([80, 80]); ctx.lineDashOffset = -animClock * 30;
            [-w * 0.25, 0, w * 0.25].forEach(off => {
                ctx.beginPath();
                for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x + spline[i].nx * off, spline[i].y + spline[i].ny * off);
                ctx.closePath(); ctx.stroke();
            });
            ctx.restore();
        }
    };

    // Safely hook drawTrack (Mirrors addon3.js logic)
    if (typeof drawTrack === 'function') {
        const baseDrawTrack = drawTrack;
        
        drawTrack = function() {
            if (!currentTrack) return;

            if (currentTrack.isDLC && currentTrack.theme) {
                if (currentTrack.theme === 'rainbow') DLCRenderer.renderRainbowRoad(ctx, currentTrack);
                else if (currentTrack.theme === 'highway') DLCRenderer.renderHustleHighway(ctx, currentTrack);
                else {
                    // Fallback for tracks without specific shaders programmed yet
                    ctx.lineWidth = currentTrack.width; ctx.strokeStyle = currentTrack.color;
                    ctx.beginPath(); ctx.moveTo(currentTrack.spline[0].x, currentTrack.spline[0].y);
                    for (let i = 1; i < currentTrack.spline.length; i++) ctx.lineTo(currentTrack.spline[i].x, currentTrack.spline[i].y);
                    ctx.closePath(); ctx.stroke();
                }
            } else {
                baseDrawTrack();
            }
        };
    }
}, 500);
