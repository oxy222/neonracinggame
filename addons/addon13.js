// addons/addon13.js - DLC Track Expansion & LT Toggle
setTimeout(() => {
    // 1. Define Expansion Tracks
    const DLC_TRACKS = [
        {
            id: 'rainbow_road', name: "RAINBOW ROAD", width: 900, color: '#ff00ff', isDLC: true, theme: 'rainbow',
            hazards: [{ type: 'boost', x: 0, y: -11500, radius: 450 }, { type: 'boost', x: 7500, y: 0, radius: 450 }],
            pts: [{ x: -8000, y: -10000 }, { x: -2000, y: -12000 }, { x: 4000, y: -9000 }, { x: 8000, y: -4000 }, { x: 5000, y: 0 }, { x: 10000, y: 5000 }, { x: 6000, y: 11000 }, { x: 0, y: 8000 }, { x: -6000, y: 11000 }, { x: -10000, y: 5000 }, { x: -5000, y: 0 }, { x: -12000, y: -5000 }]
        },
        {
            id: 'hustle_highway', name: "HUSTLE HIGHWAY", width: 1100, color: '#00f0ff', isDLC: true, theme: 'highway', hazards: [],
            pts: [{ x: -14000, y: -3000 }, { x: -14000, y: -8500 }, { x: 0, y: -8500 }, { x: 14000, y: -8500 }, { x: 14000, y: 3000 }, { x: 14000, y: 8500 }, { x: 6000, y: 8500 }, { x: 6000, y: 1500 }, { x: -2000, y: 1500 }, { x: -2000, y: 8500 }, { x: -14000, y: 8500 }]
        },
        {
            id: 'jdot_bridge', name: "JDOT BRIDGE", width: 650, color: '#ff2a55', isDLC: true, theme: 'jdot_bridge', hazards: [],
            pts: [{ x: -11000, y: -2000 }, { x: -8500, y: -6500 }, { x: -4000, y: -8500 }, { x: 2000, y: -8500 }, { x: 9000, y: -2500 }, { x: 11000, y: 0 }, { x: 9000, y: 2500 }, { x: 2000, y: 8500 }, { x: -4000, y: 8500 }, { x: -8500, y: 6500 }, { x: -11000, y: 2000 }]
        },
        {
            id: 'choco_canyon', name: "CHOCO CANYON", width: 850, color: '#b06528', isDLC: true, theme: 'choco',
            hazards: [{ type: 'mud', x: -1500, y: -8500, radius: 400 }, { type: 'mud', x: 8000, y: -5000, radius: 450 }],
            pts: [{ x: -9000, y: -9000 }, { x: -3000, y: -7000 }, { x: 0, y: -10000 }, { x: 5500, y: -6000 }, { x: 9500, y: -9000 }, { x: 7500, y: -2000 }, { x: 11500, y: 4000 }, { x: 4500, y: 6500 }, { x: 0, y: 11500 }, { x: -4500, y: 6500 }, { x: -10500, y: 2000 }, { x: -6500, y: -3000 }]
        },
        {
            id: 'bouncy_bridge', name: "BOUNCY BRIDGE", width: 750, color: '#ffe600', isDLC: true, theme: 'bouncy',
            hazards: [{ type: 'bounce', x: -6000, y: -2000, radius: 400 }, { type: 'bounce', x: 0, y: 10000, radius: 500 }],
            pts: [{ x: -13000, y: 0 }, { x: -9000, y: -4500 }, { x: -4500, y: 4500 }, { x: 0, y: -4500 }, { x: 4500, y: 4500 }, { x: 9000, y: -4500 }, { x: 13000, y: 0 }, { x: 9000, y: 8500 }, { x: 0, y: 12500 }, { x: -9000, y: 8500 }]
        },
        {
            id: 'oil_slick_circuit', name: "OIL SLICK CIRCUIT", width: 900, color: '#556677', isDLC: true, theme: 'oil_slick',
            hazards: [{ type: 'oil', x: 0, y: -10000, radius: 450 }, { type: 'oil', x: 7500, y: -2500, radius: 400 }],
            pts: [{ x: -5500, y: -10000 }, { x: 5500, y: -10000 }, { x: 10500, y: -5000 }, { x: 5500, y: 0 }, { x: 10500, y: 5000 }, { x: 5500, y: 10000 }, { x: -5500, y: 10000 }, { x: -10500, y: 5000 }, { x: -5500, y: 0 }, { x: -10500, y: -5000 }]
        }
    ];

    const LEGACY_TRACKS = [...trackDefs];
    window.NeonGP_DLC = { activePack: 'legacy' };

    // 2. Inject UI
    const controlsBox = document.querySelector('#screen-lobby .controls-box');
    if (controlsBox && !document.getElementById('dlc-banner-wrapper')) {
        controlsBox.insertAdjacentHTML('beforeend', `
            <div id="dlc-banner-wrapper" style="margin-top: 15px; border-top: 1px solid #444; padding-top: 15px;">
                <div style="display:inline-flex; align-items:center; gap:12px; background:rgba(18,18,24,0.65); padding:8px 20px; border-radius:30px; border: 1px solid #555;" id="dlc-banner">
                    <span style="background:#222; border:1px solid #777; font-weight:900; padding:2px 8px; border-radius:6px; color:#fff;">LT</span>
                    <span style="color:#aaa; font-weight:800;">CAMPAIGN:</span>
                    <span id="dlc-badge" style="background:#333; padding:4px 10px; border-radius:12px; font-weight:900; color:#aaa;">LEGACY</span>
                </div>
            </div>
        `);
    }

    function toggleCampaign() {
        const isDLC = window.NeonGP_DLC.activePack === 'dlc';
        window.NeonGP_DLC.activePack = isDLC ? 'legacy' : 'dlc';
        
        trackDefs.length = 0;
        const targetSet = window.NeonGP_DLC.activePack === 'dlc' ? DLC_TRACKS : LEGACY_TRACKS;
        targetSet.forEach(t => trackDefs.push(t));

        const badge = document.getElementById('dlc-badge');
        const banner = document.getElementById('dlc-banner');
        if (window.NeonGP_DLC.activePack === 'dlc') {
            badge.innerText = 'EXPANSION'; badge.style.background = '#00f0ff'; badge.style.color = '#000';
            banner.style.borderColor = '#00f0ff';
            if (typeof playSound === 'function') playSound('lap');
        } else {
            badge.innerText = 'LEGACY'; badge.style.background = '#333'; badge.style.color = '#aaa';
            banner.style.borderColor = '#555';
            if (typeof playSound === 'function') playSound('blip');
        }
    }

    // 3. Hook Input (Mirrors addon3.js logic)
    if (typeof pollInput === 'function') {
        const originalPollInput = pollInput;
        let lastLTPressed = false;
        
        pollInput = function() {
            originalPollInput();
            if (gameState.phase === 'lobby') {
                const gps = navigator.getGamepads ? navigator.getGamepads() : [];
                let ltTriggered = false;
                for (let i = 0; i < gps.length; i++) {
                    if (gps[i] && gps[i].buttons[6]?.pressed) ltTriggered = true;
                }
                if (ltTriggered && !lastLTPressed) toggleCampaign();
                lastLTPressed = ltTriggered;
            }
        };
    }

    // 4. Hook Physics
    if (typeof updatePhysics === 'function') {
        const originalUpdatePhysics = updatePhysics;
        
        updatePhysics = function() {
            originalUpdatePhysics();
            if (gameState.phase !== 'racing' || !currentTrack || !currentTrack.hazards) return;

            const activeP = players.filter(p => p.joined && !p.finished);
            activeP.forEach(p => {
                currentTrack.hazards.forEach(h => {
                    if (Math.hypot(p.x - h.x, p.y - h.y) < h.radius) {
                        if (h.type === 'oil') p.speed *= 0.985;
                        if (h.type === 'boost') p.speed = Math.min(p.speed + 2.5, 45); // PHYSICS.maxSpeed * 1.55
                        if (h.type === 'mud') p.speed *= 0.94;
                    }
                });
            });
        };
    }
}, 500);
