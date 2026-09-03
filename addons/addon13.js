/* -------------------------------------------------------------------------- */
/* ADDON 13: DLC TRACK ENGINE & LOBBY LT TOGGLE CONTROLLER                    */
/* -------------------------------------------------------------------------- */

(function initAddon13() {
    // 1. Define the 6 Expansion Tracks with Waypoints & Physics Metadata
    const DLC_TRACKS = [
        {
            id: 'rainbow_road',
            name: "RAINBOW ROAD",
            width: 900,
            color: '#ff00ff',
            isDLC: true,
            theme: 'rainbow',
            hazards: [
                { type: 'boost', x: 0, y: -11500, radius: 450 },
                { type: 'boost', x: 7500, y: 0, radius: 450 },
                { type: 'boost', x: -3000, y: 9500, radius: 450 }
            ],
            pts: [
                { x: -8000, y: -10000 }, { x: -2000, y: -12000 }, { x: 4000, y: -9000 },
                { x: 8000, y: -4000 },   { x: 5000, y: 0 },       { x: 10000, y: 5000 },
                { x: 6000, y: 11000 },   { x: 0, y: 8000 },       { x: -6000, y: 11000 },
                { x: -10000, y: 5000 },  { x: -5000, y: 0 },      { x: -12000, y: -5000 }
            ]
        },
        {
            id: 'hustle_highway',
            name: "HUSTLE HIGHWAY",
            width: 1100,
            color: '#00f0ff',
            isDLC: true,
            theme: 'highway',
            hazards: [],
            pts: [
                { x: -14000, y: -3000 }, { x: -14000, y: -8500 }, { x: 0, y: -8500 },
                { x: 14000, y: -8500 },  { x: 14000, y: 3000 },   { x: 14000, y: 8500 },
                { x: 6000, y: 8500 },    { x: 6000, y: 1500 },    { x: -2000, y: 1500 },
                { x: -2000, y: 8500 },   { x: -14000, y: 8500 }
            ]
        },
        {
            id: 'jdot_bridge',
            name: "JDOT BRIDGE",
            width: 650,
            color: '#ff2a55',
            isDLC: true,
            theme: 'jdot_bridge',
            hazards: [],
            pts: [
                { x: -11000, y: -2000 }, { x: -8500, y: -6500 }, { x: -4000, y: -8500 },
                { x: 2000, y: -8500 },   { x: 9000, y: -2500 },  { x: 11000, y: 0 },
                { x: 9000, y: 2500 },    { x: 2000, y: 8500 },   { x: -4000, y: 8500 },
                { x: -8500, y: 6500 },   { x: -11000, y: 2000 }
            ]
        },
        {
            id: 'choco_canyon',
            name: "CHOCO CANYON",
            width: 850,
            color: '#b06528',
            isDLC: true,
            theme: 'choco',
            hazards: [
                { type: 'mud', x: -1500, y: -8500, radius: 400 },
                { type: 'mud', x: 8000, y: -5000, radius: 450 },
                { type: 'mud', x: 2000, y: 8500, radius: 400 },
                { type: 'mud', x: -8000, y: 4000, radius: 450 }
            ],
            pts: [
                { x: -9000, y: -9000 },  { x: -3000, y: -7000 },  { x: 0, y: -10000 },
                { x: 5500, y: -6000 },   { x: 9500, y: -9000 },   { x: 7500, y: -2000 },
                { x: 11500, y: 4000 },   { x: 4500, y: 6500 },    { x: 0, y: 11500 },
                { x: -4500, y: 6500 },   { x: -10500, y: 2000 },  { x: -6500, y: -3000 }
            ]
        },
        {
            id: 'bouncy_bridge',
            name: "BOUNCY BRIDGE",
            width: 750,
            color: '#ffe600',
            isDLC: true,
            theme: 'bouncy',
            hazards: [
                { type: 'bounce', x: -6000, y: -2000, radius: 400 },
                { type: 'bounce', x: -2000, y: 2000, radius: 400 },
                { type: 'bounce', x: 2000, y: -2000, radius: 400 },
                { type: 'bounce', x: 6000, y: 2000, radius: 400 },
                { type: 'bounce', x: 0, y: 10000, radius: 500 }
            ],
            pts: [
                { x: -13000, y: 0 },     { x: -9000, y: -4500 },  { x: -4500, y: 4500 },
                { x: 0, y: -4500 },      { x: 4500, y: 4500 },    { x: 9000, y: -4500 },
                { x: 13000, y: 0 },      { x: 9000, y: 8500 },    { x: 0, y: 12500 },
                { x: -9000, y: 8500 }
            ]
        },
        {
            id: 'oil_slick_circuit',
            name: "OIL SLICK CIRCUIT",
            width: 900,
            color: '#556677',
            isDLC: true,
            theme: 'oil_slick',
            hazards: [
                { type: 'oil', x: 0, y: -10000, radius: 450 },
                { type: 'oil', x: 7500, y: -2500, radius: 400 },
                { type: 'oil', x: 7500, y: 7500, radius: 450 },
                { type: 'oil', x: -7500, y: 7500, radius: 450 },
                { type: 'oil', x: -7500, y: -2500, radius: 400 }
            ],
            pts: [
                { x: -5500, y: -10000 }, { x: 5500, y: -10000 }, { x: 10500, y: -5000 },
                { x: 5500, y: 0 },       { x: 10500, y: 5000 },   { x: 5500, y: 10000 },
                { x: -5500, y: 10000 },  { x: -10500, y: 5000 },  { x: -5500, y: 0 },
                { x: -10500, y: -5000 }
            ]
        }
    ];

    // Backup baseline legacy tracks
    const LEGACY_TRACKS = [...trackDefs];

    // 2. Global State for Campaign Pack
    window.NeonGP_DLC = {
        activePack: 'legacy', // 'legacy' or 'dlc'
        dlcTracks: DLC_TRACKS,
        legacyTracks: LEGACY_TRACKS
    };

    // 3. Inject Liquid Glass UI Styles for Car Select
    const dlcStyle = document.createElement('style');
    dlcStyle.innerHTML = `
        .dlc-toggle-banner {
            margin-top: 15px;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: rgba(18, 18, 24, 0.65);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 8px 20px;
            border-radius: 30px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dlc-toggle-banner.dlc-active {
            border-color: #00f0ff;
            background: rgba(0, 240, 255, 0.12);
            box-shadow: 0 0 25px rgba(0, 240, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .dlc-toggle-badge {
            font-size: 0.8rem;
            font-weight: 900;
            letter-spacing: 1px;
            padding: 3px 10px;
            border-radius: 12px;
            text-transform: uppercase;
        }
        .dlc-toggle-badge.legacy { background: #333; color: #aaa; }
        .dlc-toggle-badge.dlc { background: #00f0ff; color: #000; box-shadow: 0 0 10px #00f0ff; }
        .dlc-track-pill-bar {
            display: flex; gap: 8px; margin-top: 10px; justify-content: center; flex-wrap: wrap; max-width: 900px;
        }
        .dlc-track-pill {
            font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 12px;
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #ccc;
        }
        .dlc-track-pill.active-mode { border-color: #ff00ff; color: #fff; text-shadow: 0 0 5px #ff00ff; }
    `;
    document.head.appendChild(dlcStyle);

    // 4. Inject Banner into Lobby Controls Box
    function injectLobbyBanner() {
        const controlsBox = document.querySelector('#screen-lobby .controls-box');
        if (!controlsBox || document.getElementById('dlc-banner-wrapper')) return;

        const banner = document.createElement('div');
        banner.id = 'dlc-banner-wrapper';
        banner.innerHTML = `
            <div class="dlc-toggle-banner" id="dlc-banner">
                <span class="btn-prompt" style="background:#222; border: 1px solid #777; font-size:12px; font-weight:900; width:36px; height:24px; border-radius:6px;">LT</span>
                <span style="color:#aaa; font-size: 0.9rem;">CAMPAIGN:</span>
                <span class="dlc-toggle-badge legacy" id="dlc-badge">LEGACY (8 MAPS)</span>
                <span style="font-size:0.8rem; color:#777;">(OR PRESS Q / TAB)</span>
            </div>
            <div class="dlc-track-pill-bar" id="dlc-pill-bar">
                <span class="dlc-track-pill">RAINBOW ROAD</span>
                <span class="dlc-track-pill">HUSTLE HIGHWAY</span>
                <span class="dlc-track-pill">JDOT BRIDGE</span>
                <span class="dlc-track-pill">CHOCO CANYON</span>
                <span class="dlc-track-pill">BOUNCY BRIDGE</span>
                <span class="dlc-track-pill">OIL SLICK</span>
            </div>
        `;
        controlsBox.appendChild(banner);
    }
    setTimeout(injectLobbyBanner, 200);

    // 5. Toggle Functionality
    function toggleCampaign() {
        const isDLC = window.NeonGP_DLC.activePack === 'dlc';
        window.NeonGP_DLC.activePack = isDLC ? 'legacy' : 'dlc';

        // Mutate trackDefs array directly in place
        trackDefs.length = 0;
        const targetSet = window.NeonGP_DLC.activePack === 'dlc' ? DLC_TRACKS : LEGACY_TRACKS;
        targetSet.forEach(t => trackDefs.push(t));

        // Update UI
        const banner = document.getElementById('dlc-banner');
        const badge = document.getElementById('dlc-badge');
        const pills = document.querySelectorAll('.dlc-track-pill');

        if (window.NeonGP_DLC.activePack === 'dlc') {
            banner?.classList.add('dlc-active');
            if (badge) {
                badge.className = 'dlc-toggle-badge dlc';
                badge.innerText = 'DLC EXPANSION (6 MAPS)';
            }
            pills.forEach(p => p.classList.add('active-mode'));
            playSound('lap');
        } else {
            banner?.classList.remove('dlc-active');
            if (badge) {
                badge.className = 'dlc-toggle-badge legacy';
                badge.innerText = 'LEGACY (8 MAPS)';
            }
            pills.forEach(p => p.classList.remove('active-mode'));
            playSound('blip');
        }
    }

    // 6. Listen for LT (Left Trigger) on Gamepads and Q / Tab on Keyboard
    let lastLTPressed = false;
    let lastQPressed = false;

    window.addEventListener('keydown', (e) => {
        if (gameState.phase === 'lobby' && (e.code === 'KeyQ' || e.code === 'Tab')) {
            e.preventDefault();
            toggleCampaign();
        }
    });

    const originalPollInput = window.pollInput;
    window.pollInput = function() {
        originalPollInput();

        if (gameState.phase === 'lobby') {
            const gps = navigator.getGamepads ? navigator.getGamepads() : [];
            let ltTriggered = false;
            for (let i = 0; i < gps.length; i++) {
                const pad = gps[i];
                if (pad && pad.buttons[6]?.pressed) { // Button 6 = LT
                    ltTriggered = true;
                    break;
                }
            }
            if (ltTriggered && !lastLTPressed) {
                toggleCampaign();
            }
            lastLTPressed = ltTriggered;
        }
    };

    // 7. Interactive Surface & Hazard Physics Engine Hook
    const originalUpdatePhysics = window.updatePhysics;
    window.updatePhysics = function() {
        originalUpdatePhysics();

        if (gameState.phase !== 'racing' || !currentTrack || !currentTrack.hazards) return;

        const activeP = players.filter(p => p.joined && !p.finished);
        activeP.forEach(p => {
            currentTrack.hazards.forEach(h => {
                const dist = Math.hypot(p.x - h.x, p.y - h.y);
                if (dist < h.radius) {
                    if (h.type === 'oil') {
                        // Friction reduction & slip angle torque
                        p.speed *= 0.985;
                        p.angle += (Math.random() - 0.5) * 0.08;
                        if (Math.random() > 0.6) {
                            particles.push({
                                x: p.x, y: p.y,
                                vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
                                life: 0.8, color: '#111', size: Math.random() * 18 + 8
                            });
                        }
                    } else if (h.type === 'bounce') {
                        // Spring Pad acceleration burst
                        if (!p.bounceCooldown) {
                            p.speed = Math.max(p.speed + 7, PHYSICS.maxSpeed * 1.3);
                            p.bounceCooldown = 30;
                            playSound('ready');
                            for (let k = 0; k < 12; k++) {
                                particles.push({
                                    x: p.x, y: p.y,
                                    vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 20,
                                    life: 1.0, color: '#ffff00', size: Math.random() * 15 + 6
                                });
                            }
                        }
                    } else if (h.type === 'boost') {
                        // Rainbow boost ring
                        p.speed = Math.min(p.speed + 2.5, PHYSICS.maxSpeed * 1.55);
                        p.turboProgress = Math.min(100, p.turboProgress + 1.2);
                        particles.push({
                            x: p.x - Math.cos(p.angle) * 70, y: p.y - Math.sin(p.angle) * 70,
                            vx: -Math.cos(p.angle) * 15, vy: -Math.sin(p.angle) * 15,
                            life: 0.8, color: ['#f0f', '#0ff', '#ff0'][Math.floor(Math.random() * 3)], size: 20
                        });
                    } else if (h.type === 'mud') {
                        // Canyon mud deceleration
                        p.speed *= 0.94;
                        particles.push({
                            x: p.x, y: p.y,
                            vx: -p.vx * 0.2 + (Math.random() - 0.5) * 6, vy: -p.vy * 0.2 + (Math.random() - 0.5) * 6,
                            life: 0.8, color: '#522b10', size: Math.random() * 16 + 6
                        });
                    }
                }
            });

            if (p.bounceCooldown && p.bounceCooldown > 0) p.bounceCooldown--;
        });
    };

    // 8. Auto-load Addon 14 (Visual Render Core)
    if (!document.querySelector('script[src*="addon14.js"]')) {
        const s = document.createElement('script');
        s.src = 'addons/addon14.js';
        s.onerror = () => console.warn("addon14.js could not be loaded automatically. Please verify addons/ directory.");
        document.head.appendChild(s);
    }

    console.log("Addon 13: DLC Track Expansion Engine & LT Lobby Integration Loaded.");
})();
