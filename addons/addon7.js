// addons/addon7.js - MK-Style HUD & Lobby Enhancements
// Adds a live position/speed/ability tracker during races, player name inputs, and power-up UI prompts.

const injectMKStyles = () => {
    const style = document.createElement('style');
    style.id = 'mk-hud-styles';
    style.innerHTML = `
        /* Live HUD Container */
        #mk-hud-container {
            position: absolute;
            left: 2vw;
            top: 10vh;
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 100;
            pointer-events: none;
        }

        /* Individual Player Row in HUD */
        .mk-player-row {
            display: flex;
            align-items: center;
            background: rgba(15, 15, 20, 0.85);
            border-left: 6px solid var(--p-color);
            border-radius: 0 25px 25px 0;
            padding: 10px 20px;
            width: 18vw;
            min-width: 280px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.5);
            backdrop-filter: blur(8px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Dynamic Ranking Position */
        .mk-rank {
            font-size: 2.2rem;
            font-weight: 900;
            font-style: italic;
            margin-right: 15px;
            text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
            width: 50px;
            text-align: center;
        }

        .mk-info {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        /* Player Name Formatting */
        .mk-name {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            font-size: 1.2rem;
            color: #fff;
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 2px;
        }

        /* Speedometer Readout */
        .mk-speed {
            font-family: 'Press Start 2P', monospace;
            font-size: 0.7rem;
            color: #aaa;
        }

        /* Ability Tracker Box */
        .mk-ability-box {
            width: 45px;
            height: 45px;
            border: 2px solid #555;
            border-radius: 8px;
            margin-left: 10px;
            position: relative;
            background: #111;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }

        .mk-ability-fill {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: var(--p-color);
            opacity: 0.4;
            transition: height 0.1s linear;
        }
        
        .mk-ability-fill.ready {
            opacity: 0.8;
            box-shadow: 0 0 10px var(--p-color);
        }

        .mk-ability-icon { z-index: 2; }

        /* HUD Button Prompt */
        .mk-hud-prompt {
            position: absolute;
            bottom: -5px;
            right: -5px;
            background: #222;
            border: 2px solid #666;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            color: white;
            z-index: 3;
            box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        /* Lobby Name Input */
        .name-input {
            background: rgba(0,0,0,0.3);
            border: 2px solid transparent;
            border-bottom: 2px dashed #666;
            color: white;
            font-family: 'Montserrat', sans-serif;
            font-size: clamp(1rem, 2vmin, 1.5rem);
            text-align: center;
            width: 90%;
            outline: none;
            margin: 5px 0 15px 0;
            padding: 5px;
            font-weight: 900;
            font-style: italic;
            text-transform: uppercase;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .name-input:focus {
            border-color: var(--p-color);
            background: rgba(0,0,0,0.8);
            border-style: solid;
        }

        /* Power-up Arrow Prompts */
        .pu-arrow-btn {
            background: #222;
            border: 2px solid #555;
            color: #fff;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 0.7rem;
            margin: 0 5px;
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            box-shadow: 0 2px 0 #111;
        }
    `;
    document.head.appendChild(style);
};

const initMKHUD = () => {
    if (!document.getElementById('mk-hud-container')) {
        const container = document.createElement('div');
        container.id = 'mk-hud-container';
        const hudLayer = document.getElementById('hud');
        if (hudLayer) hudLayer.appendChild(container);
    }
};

const updateMKHUD = () => {
    const container = document.getElementById('mk-hud-container');
    if (!container) return;

    // Only render the MK HUD when actively racing or in the intro countdown
    if (typeof gameState === 'undefined' || !['race_intro', 'racing'].includes(gameState.phase)) {
        container.innerHTML = ''; 
        return;
    }

    const activeP = players.filter(p => p.joined);
    
    // Sort players dynamically based on their true race position
    const sortedP = [...activeP].sort((a, b) => {
        if (a.lap !== b.lap) return b.lap - a.lap;
        if (a.checkIdx !== b.checkIdx) return b.checkIdx - a.checkIdx;
        
        // Tie-breaker: Distance to next checkpoint
        if (typeof currentTrack !== 'undefined' && currentTrack) {
            const checks = currentTrack.checkpoints;
            const nextA = checks[(a.checkIdx + 1) % checks.length];
            const nextB = checks[(b.checkIdx + 1) % checks.length];
            const distA = Math.hypot(a.x - nextA.x, a.y - nextA.y);
            const distB = Math.hypot(b.x - nextB.x, b.y - nextB.y);
            return distA - distB; 
        }
        return 0;
    });

    // Update or generate rows for each player
    sortedP.forEach((p, currentRankIdx) => {
        let row = document.getElementById(`mk-row-${p.id}`);
        
        if (!row) {
            row = document.createElement('div');
            row.id = `mk-row-${p.id}`;
            row.className = 'mk-player-row';
            row.innerHTML = `
                <div class="mk-rank"></div>
                <div class="mk-info">
                    <div class="mk-name"></div>
                    <div class="mk-speed"></div>
                </div>
                <div class="mk-ability-box">
                    <div class="mk-ability-fill"></div>
                    <div class="mk-ability-icon"></div>
                    <div class="mk-hud-prompt"></div>
                </div>
            `;
            container.appendChild(row);
        }

        // 1. Dynamic Reordering via CSS Flex Order (smooth visual transitions)
        row.style.order = currentRankIdx;
        
        // 2. Rank Text & Coloring
        const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32', '#aaaaaa'];
        const rankText = ['1ST', '2ND', '3RD', '4TH'];
        const rankEl = row.querySelector('.mk-rank');
        rankEl.innerText = rankText[currentRankIdx];
        rankEl.style.color = rankColors[currentRankIdx];
        
        // 3. Player Details
        row.querySelector('.mk-name').innerText = p.customName || `PLAYER ${p.id + 1}`;
        row.style.setProperty('--p-color', p.color);
        
        // Match the speedometer readout multiplier from the rendering engine
        const speedMPH = Math.floor(Math.abs(p.speed) * 4.1);
        row.querySelector('.mk-speed').innerText = `${speedMPH} MPH`;
        
        // 4. Ability Tracker
        const specDef = window.NeonGP.specials[p.specialIdx] || { name: 'UNKNOWN' };
        const fillPct = Math.min(100, p.specialProgress || 0);
        const fillEl = row.querySelector('.mk-ability-fill');
        
        fillEl.style.height = `${fillPct}%`;
        if (fillPct >= 100) fillEl.classList.add('ready');
        else fillEl.classList.remove('ready');
        
        // Map icon based on powerup name keywords
        let icon = '⭐';
        if (specDef.name.includes('MAGNET')) icon = '🧲';
        if (specDef.name.includes('NITRO')) icon = '🔥';
        if (specDef.name.includes('FIREBALL')) icon = '☄️';
        row.querySelector('.mk-ability-icon').innerText = icon;

        // 5. Contextual Input Prompts based on controller type
        let btnHint = 'X';
        if (p.inputId === 0) btnHint = 'E';      // KB 1
        if (p.inputId === 1) btnHint = '/';      // KB 2
        row.querySelector('.mk-hud-prompt').innerText = btnHint;
    });
};

setTimeout(() => {
    injectMKStyles();
    initMKHUD();
    
    // Start continuous UI loop decoupled from physics
    const loopMKHUD = () => {
        updateMKHUD();
        requestAnimationFrame(loopMKHUD);
    };
    loopMKHUD();

    // Intercept standard lobby drawing to insert our new UI
    if (typeof updateLobbyUI === 'function') {
        const originalUpdateLobbyUI = updateLobbyUI;
        
        updateLobbyUI = function() {
            originalUpdateLobbyUI(); 
            
            players.forEach((p, i) => {
                const slot = document.getElementById(`slot-${i}`);
                if (!slot) return;

                // 1. Inject Custom Name Input
                let nameInp = slot.querySelector('.name-input');
                if (!nameInp) {
                    nameInp = document.createElement('input');
                    nameInp.className = 'name-input';
                    nameInp.maxLength = 8;
                    nameInp.placeholder = `PLAYER ${i + 1}`;
                    nameInp.value = p.customName || '';
                    
                    nameInp.addEventListener('input', (e) => {
                        p.customName = e.target.value.toUpperCase();
                    });
                    
                    // Replace the standard P1/P2 header text with the input
                    const header = slot.querySelector('.p-header');
                    if (header) {
                        header.innerHTML = '';
                        header.appendChild(nameInp);
                    }
                }
                nameInp.style.opacity = (p.joined && !p.ready) ? '1' : '0.5';
                nameInp.disabled = (!p.joined || p.ready);

                // 2. Inject D-Pad Arrow Button Indicators around Special
                const specName = slot.querySelector('.special-name');
                if (specName && !slot.querySelector('.pu-arrow-btn')) {
                    specName.style.display = 'flex';
                    specName.style.alignItems = 'center';
                    specName.style.justifyContent = 'center';
                    
                    const upHtml = `<span class="pu-arrow-btn">▲</span>`;
                    const downHtml = `<span class="pu-arrow-btn">▼</span>`;
                    
                    // We preserve the inner text and wrap it
                    const textSpan = document.createElement('span');
                    textSpan.innerText = specName.innerText;
                    textSpan.style.margin = '0 10px';
                    
                    specName.innerHTML = upHtml;
                    specName.appendChild(textSpan);
                    specName.innerHTML += downHtml;
                } else if (specName) {
                    // Just update the text if already wrapped
                    const textSpan = specName.querySelector('span:not(.pu-arrow-btn)');
                    if (textSpan) {
                        textSpan.innerText = window.NeonGP.specials[p.specialIdx]?.name || '';
                    }
                }
                
                // Dim arrows if not actively choosing
                const arrows = slot.querySelectorAll('.pu-arrow-btn');
                arrows.forEach(a => a.style.opacity = (p.joined && !p.ready) ? '1' : '0.2');
            });
        };
        // Trigger update to apply modifications to existing lobby
        if (typeof gameState !== 'undefined' && gameState.phase === 'lobby') updateLobbyUI();
    }

    if (typeof pollInput === 'function') {
        const originalPollInput = pollInput;
        pollInput = function() {
            // Check if any player is currently typing in a name input
            const activeEl = document.activeElement;
            if (activeEl && activeEl.classList.contains('name-input')) {
                // Wipe conflicting keyboard states to prevent accidental car switching/readying up
                keys['Space'] = false; keys['Enter'] = false;
                keys['KeyW'] = false; keys['KeyS'] = false; keys['KeyA'] = false; keys['KeyD'] = false;
                keys['ArrowUp'] = false; keys['ArrowDown'] = false; keys['ArrowLeft'] = false; keys['ArrowRight'] = false;
            }
            originalPollInput();
        };
    }
    
    if (typeof populateTable === 'function') {
        const origPopulateTable = populateTable;
        populateTable = function(tableId, isFinal) {
            origPopulateTable(tableId, isFinal);
            
            // Post-process the generated table to inject custom names
            const table = document.getElementById(tableId);
            if (table) {
                const active = players.filter(p => p.joined).sort((a,b) => b.totalPts - a.totalPts);
                const rows = table.querySelectorAll('tr');
                
                active.forEach((p, i) => {
                    // +1 to skip header row
                    if (rows[i + 1]) {
                        const nameCell = rows[i + 1].querySelectorAll('td')[1];
                        if (nameCell) nameCell.innerText = p.customName || `P${p.id + 1}`;
                    }
                });
            }
        };
    }
    
}, 1000); // 1000ms delay ensures UI structural overhauls (like addon6) run first
