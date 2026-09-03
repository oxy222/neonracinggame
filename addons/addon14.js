/* -------------------------------------------------------------------------- */
/* ADDON 14: ADVANCED PROCEDURAL TRACK RENDERER & SHADER PIPELINE             */
/* -------------------------------------------------------------------------- */

(function initAddon14() {
    let animClock = 0;

    const DLCRenderer = {
        renderRainbowRoad(ctx, track) {
            const spline = track.spline;
            const w = track.width;
            animClock += 0.02;

            // Deep Space Void Aura
            ctx.lineWidth = w + 1000;
            ctx.strokeStyle = 'rgba(10, 0, 25, 0.8)';
            ctx.beginPath();
            ctx.moveTo(spline[0].x, spline[0].y);
            for (let i = 1; i < spline.length; i++) ctx.lineTo(spline[i].x, spline[i].y);
            ctx.closePath();
            ctx.stroke();

            // Flowing Multi-Ribbon Spectral Road Deck
            const colors = ['#ff0033', '#ff9900', '#ffff00', '#33ff00', '#00ffff', '#9900ff'];
            const laneWidth = w / colors.length;

            colors.forEach((col, idx) => {
                const offset = -w / 2 + laneWidth * (idx + 0.5);
                ctx.lineWidth = laneWidth + 4;
                ctx.strokeStyle = col;
                ctx.beginPath();
                for (let i = 0; i < spline.length; i++) {
                    const pt = spline[i];
                    const px = pt.x + pt.nx * offset;
                    const py = pt.y + pt.ny * offset;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.stroke();
            });

            // Animated Energy Prisms (Speed Boost Rings)
            track.hazards.forEach(h => {
                ctx.save();
                ctx.translate(h.x, h.y);
                ctx.rotate(animClock * 1.5);
                ctx.lineWidth = 14;
                ctx.strokeStyle = '#ffffff';
                ctx.shadowBlur = 35;
                ctx.shadowColor = '#00ffff';
                ctx.strokeRect(-h.radius * 0.7, -h.radius * 0.7, h.radius * 1.4, h.radius * 1.4);
                ctx.restore();
            });

            // Sparkling Stardust Neon Barrier Edges
            ctx.lineWidth = 20;
            ctx.strokeStyle = '#ffffff';
            ctx.shadowBlur = 40;
            ctx.shadowColor = '#ff00ff';
            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x + spline[i].nx * (w / 2), spline[i].y + spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x - spline[i].nx * (w / 2), spline[i].y - spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0;
        },

        renderHustleHighway(ctx, track) {
            const spline = track.spline;
            const w = track.width;
            animClock += 0.8;

            // Highway Shoulder / Gravel
            ctx.lineWidth = w + 450;
            ctx.strokeStyle = '#1e2029';
            ctx.beginPath();
            ctx.moveTo(spline[0].x, spline[0].y);
            for (let i = 1; i < spline.length; i++) ctx.lineTo(spline[i].x, spline[i].y);
            ctx.closePath();
            ctx.stroke();

            // Dark Asphalt Core
            ctx.lineWidth = w;
            ctx.strokeStyle = '#0e1014';
            ctx.stroke();

            // 4 Separated Highway Lanes with Moving Dashed Markers
            const laneOffsets = [-w * 0.25, 0, w * 0.25];
            ctx.save();
            ctx.lineWidth = 12;
            ctx.strokeStyle = '#00f0ff';
            ctx.setLineDash([80, 80]);
            ctx.lineDashOffset = -animClock * 30;

            laneOffsets.forEach(off => {
                ctx.beginPath();
                for (let i = 0; i < spline.length; i++) {
                    const x = spline[i].x + spline[i].nx * off;
                    const y = spline[i].y + spline[i].ny * off;
                    ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y);
                }
                ctx.closePath();
                ctx.stroke();
            });
            ctx.restore();

            // Heavy Neon Guard Rails
            ctx.lineWidth = 18;
            ctx.strokeStyle = '#00f0ff';
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#00f0ff';
            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x + spline[i].nx * (w / 2), spline[i].y + spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x - spline[i].nx * (w / 2), spline[i].y - spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0;
        },

        renderJDotBridge(ctx, track) {
            const spline = track.spline;
            const w = track.width;

            // Rushing Deep River Below Track
            ctx.lineWidth = w + 1800;
            ctx.strokeStyle = '#050c18';
            ctx.beginPath();
            ctx.moveTo(spline[0].x, spline[0].y);
            for (let i = 1; i < spline.length; i++) ctx.lineTo(spline[i].x, spline[i].y);
            ctx.closePath();
            ctx.stroke();

            // Bridge Metal Girders Floor
            ctx.lineWidth = w + 80;
            ctx.strokeStyle = '#22252c';
            ctx.stroke();

            // Road Deck
            ctx.lineWidth = w;
            ctx.strokeStyle = '#15171d';
            ctx.stroke();

            // Steel Expansion Joints Across the Span
            ctx.save();
            ctx.lineWidth = 8;
            ctx.strokeStyle = '#333845';
            ctx.setLineDash([20, 250]);
            ctx.beginPath();
            ctx.moveTo(spline[0].x, spline[0].y);
            for (let i = 1; i < spline.length; i++) ctx.lineTo(spline[i].x, spline[i].y);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

            // Massive Suspension Pylons & Cables
            for (let i = 0; i < spline.length; i += 40) {
                const pt = spline[i];
                ctx.save();
                ctx.translate(pt.x, pt.y);
                ctx.fillStyle = '#ff2a55';
                ctx.shadowBlur = 40;
                ctx.shadowColor = '#ff2a55';
                // Tower Columns on left & right
                ctx.fillRect(-w / 2 - 100, -80, 80, 160);
                ctx.fillRect(w / 2 + 20, -80, 80, 160);
                // Overhead Arch Beam
                ctx.fillRect(-w / 2 - 100, -80, w + 200, 30);
                ctx.restore();
            }

            // High-Tension Perimeter Neon Cable
            ctx.lineWidth = 16;
            ctx.strokeStyle = '#ff2a55';
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#ff2a55';
            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x + spline[i].nx * (w / 2), spline[i].y + spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x - spline[i].nx * (w / 2), spline[i].y - spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0;
        },

        renderChocoCanyon(ctx, track) {
            const spline = track.spline;
            const w = track.width;

            // Tiered Canyon Rock Walls
            ctx.lineWidth = w + 1400;
            ctx.strokeStyle = '#4a2510';
            ctx.beginPath();
            ctx.moveTo(spline[0].x, spline[0].y);
            for (let i = 1; i < spline.length; i++) ctx.lineTo(spline[i].x, spline[i].y);
            ctx.closePath();
            ctx.stroke();

            ctx.lineWidth = w + 600;
            ctx.strokeStyle = '#633418';
            ctx.stroke();

            // Fudge Road Surface
            ctx.lineWidth = w;
            ctx.strokeStyle = '#2d160a';
            ctx.stroke();

            // Mud Traps
            track.hazards.forEach(h => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#1e0c04';
                ctx.fill();
                ctx.lineWidth = 8;
                ctx.strokeStyle = '#421a08';
                ctx.stroke();
                ctx.restore();
            });

            // Amber Neon Edge Guides
            ctx.lineWidth = 14;
            ctx.strokeStyle = '#f59338';
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#f59338';
            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x + spline[i].nx * (w / 2), spline[i].y + spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x - spline[i].nx * (w / 2), spline[i].y - spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0;
        },

        renderBouncyBridge(ctx, track) {
            const spline = track.spline;
            const w = track.width;
            animClock += 0.04;

            // Anti-gravity Chasm
            ctx.lineWidth = w + 800;
            ctx.strokeStyle = '#121200';
            ctx.beginPath();
            ctx.moveTo(spline[0].x, spline[0].y);
            for (let i = 1; i < spline.length; i++) ctx.lineTo(spline[i].x, spline[i].y);
            ctx.closePath();
            ctx.stroke();

            // Pontoon Floating Platform
            ctx.lineWidth = w;
            ctx.strokeStyle = '#2b2a05';
            ctx.stroke();

            // Pulsating Hexagonal Spring Launchers
            track.hazards.forEach(h => {
                ctx.save();
                ctx.translate(h.x, h.y);
                const pulse = Math.sin(animClock * 4) * 0.15 + 1;
                ctx.scale(pulse, pulse);
                ctx.beginPath();
                ctx.arc(0, 0, h.radius * 0.8, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 230, 0, 0.25)';
                ctx.fill();
                ctx.lineWidth = 12;
                ctx.strokeStyle = '#ffff00';
                ctx.shadowBlur = 30;
                ctx.shadowColor = '#ffff00';
                ctx.stroke();
                ctx.restore();
            });

            // Energized Kinetic Perimeter
            ctx.lineWidth = 18;
            ctx.strokeStyle = '#ffff00';
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#ffff00';
            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x + spline[i].nx * (w / 2), spline[i].y + spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x - spline[i].nx * (w / 2), spline[i].y - spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0;
        },

        renderOilSlick(ctx, track) {
            const spline = track.spline;
            const w = track.width;

            // Industrial Concrete Ground
            ctx.lineWidth = w + 700;
            ctx.strokeStyle = '#181b20';
            ctx.beginPath();
            ctx.moveTo(spline[0].x, spline[0].y);
            for (let i = 1; i < spline.length; i++) ctx.lineTo(spline[i].x, spline[i].y);
            ctx.closePath();
            ctx.stroke();

            // Wet Slick Asphalt
            ctx.lineWidth = w;
            ctx.strokeStyle = '#08090b';
            ctx.stroke();

            // Iridescent Oil Puddles (Rainbow Sheen Shading)
            track.hazards.forEach((h, idx) => {
                ctx.save();
                ctx.translate(h.x, h.y);
                const grad = ctx.createRadialGradient(0, 0, 20, 0, 0, h.radius);
                grad.addColorStop(0, 'rgba(0, 255, 200, 0.6)');
                grad.addColorStop(0.3, 'rgba(255, 0, 150, 0.5)');
                grad.addColorStop(0.7, 'rgba(255, 255, 0, 0.4)');
                grad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(0, 0, h.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // Industrial Hazard Stripes
            ctx.lineWidth = 16;
            ctx.strokeStyle = '#556677';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#8899aa';
            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x + spline[i].nx * (w / 2), spline[i].y + spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            for (let i = 0; i < spline.length; i++) ctx[i === 0 ? 'moveTo' : 'lineTo'](spline[i].x - spline[i].nx * (w / 2), spline[i].y - spline[i].ny * (w / 2));
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    };

    // Global Registry
    window.NeonGPDLCRenderer = DLCRenderer;

    // Hook Global drawTrack Function[cite: 1]
    const baseDrawTrack = window.drawTrack;
    window.drawTrack = function() {
        if (!currentTrack) return;

        if (currentTrack.isDLC && currentTrack.theme) {
            if (currentTrack.theme === 'rainbow') DLCRenderer.renderRainbowRoad(ctx, currentTrack);
            else if (currentTrack.theme === 'highway') DLCRenderer.renderHustleHighway(ctx, currentTrack);
            else if (currentTrack.theme === 'jdot_bridge') DLCRenderer.renderJDotBridge(ctx, currentTrack);
            else if (currentTrack.theme === 'choco') DLCRenderer.renderChocoCanyon(ctx, currentTrack);
            else if (currentTrack.theme === 'bouncy') DLCRenderer.renderBouncyBridge(ctx, currentTrack);
            else if (currentTrack.theme === 'oil_slick') DLCRenderer.renderOilSlick(ctx, currentTrack);
            else baseDrawTrack();

            // Render Start Line Checkered Pattern for DLC Tracks[cite: 1]
            const p0 = currentTrack.checkpoints[0];
            const p1 = currentTrack.checkpoints[1];
            ctx.save();
            ctx.translate(p0.x, p0.y);
            ctx.rotate(Math.atan2(p1.y - p0.y, p1.x - p0.x));
            ctx.fillStyle = '#fff';
            for (let i = -currentTrack.width / 2; i < currentTrack.width / 2; i += 60) {
                ctx.fillRect(0, i, 30, 30);
                ctx.fillRect(30, i + 30, 30, 30);
            }
            ctx.restore();
        } else {
            baseDrawTrack();
        }
    };

    console.log("Addon 14: Procedural Visual Shader Pipeline Loaded.");
})();
