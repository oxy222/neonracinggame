// addons/addon5.js - Mod Toggle Menu & Universal Input Fix
// Adds a fully integrated Mod Manager to the main menu and enables ALL gamepads to pause/navigate menus.

let availableMods = [];
let modSelectionIdx = 0;
let prevMKey = false;

const injectModUI = () => {
    // 1. Add Hint to Main Menu
    const menuScreen = document.getElementById('screen-menu');
    if (menuScreen && !document.getElementById('mods-hint')) {
        const hint = document.createElement('div');
        hint.id = 'mods-hint';
        hint.style.marginTop = '2rem';
        hint.style.color = '#888';
        hint.style.fontSize = '1.2rem';
        hint.style.fontWeight = '700';
        hint.innerHTML = `<span class="btn-prompt btn-y" style="background:var(--xbox-y);color:#000;">Y</span> MOD MANAGER &nbsp;&nbsp; <span style="font-size:0.8rem;">(KB: M)</span>`;
        menuScreen.appendChild(hint);
    }

    // 2. Build the Mod Menu Screen
    if (!document.getElementById('screen-mods')) {
        const modScreen = document.createElement('div');
        modScreen.id = 'screen-mods';
        modScreen.className = 'screen';
        modScreen.innerHTML = `
            <h2>MOD MANAGER</h2>
            <div id="mod-list" style="width: 80%; max-width: 800px; max-height: 50vh; overflow-y: auto; background: rgba(0,0,0,0.8); border: 2px solid #555; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 15px;">
                <div style="text-align:center; color:#aaa;">LOADING MODS...</div>
            </div>
            <div style="margin-top: 2rem; display: flex; align-items: center; font-weight: 800; font-size: 1.5rem;" class="blink">
                PRESS <span class="btn-prompt btn-b">B</span> TO APPLY & RESTART
            </div>
        `;
        document.getElementById('ui-layer').appendChild(modScreen);
    }
};

async function preloadMods() {
    const disabledMods = JSON.parse(localStorage.getItem('NeonGP_disabledMods') || '[]');
    const types = ['addon', 'powerup'];
    const promises = [];
    
    types.forEach(type => {
        for(let i=1; i<=20; i++) {
            const fileName = `${type}${i}.js`;
            promises.push(
                fetch(`addons/${fileName}`)
                .then(res => res.ok ? res.text() : Promise.reject('Not found'))
                .then(text => {
                    const lines = text.split('\n');
                    let title = fileName;
                    let desc = "No description provided.";
                    
                    // Parse comments dynamically from the file headers
                    if (lines[0] && lines[0].startsWith('//')) {
                        const parts = lines[0].split('-');
                        if (parts.length > 1) title = parts.slice(1).join('-').trim();
                    }
                    if (lines[1] && lines[1].startsWith('//')) {
                        desc = lines[1].substring(2).trim();
                    }
                    availableMods.push({ file: fileName, title, desc, enabled: !disabledMods.includes(fileName) });
                }).catch(e => {}) // Fail silently for skipped addon numbers
            );
        }
    });
    
    await Promise.all(promises);
    availableMods.sort((a,b) => a.file.localeCompare(b.file));
    renderModList();
}

function renderModList() {
    const list = document.getElementById('mod-list');
    if (!list) return;
    
    if (availableMods.length === 0) {
        list.innerHTML = `<div style="text-align:center; color:#aaa;">NO MODS DETECTED IN /addons/ DIRECTORY</div>`;
        return;
    }
    
    list.innerHTML = availableMods.map((mod, idx) => `
        <div class="mod-item ${idx === modSelectionIdx ? 'selected' : ''}" style="padding: 15px; border: 2px solid ${idx === modSelectionIdx ? 'var(--switch-red)' : '#444'}; border-radius: 8px; background: ${idx === modSelectionIdx ? 'rgba(230,0,18,0.2)' : 'transparent'}; display: flex; justify-content: space-between; align-items: center; transition: all 0.1s;">
            <div>
                <div style="font-size: 1.2rem; font-weight: 900; color: #fff; margin-bottom: 5px;">${mod.title}</div>
                <div style="font-size: 0.9rem; color: #aaa; font-weight: 700;">${mod.desc}</div>
                <div style="font-size: 0.7rem; color: #555; margin-top: 5px; font-family: 'Press Start 2P', monospace;">${mod.file}</div>
            </div>
            <div style="font-size: 1.5rem; font-weight: 900; color: ${mod.enabled ? '#0f0' : '#f00'}; text-shadow: 0 0 10px ${mod.enabled ? '#0f0' : '#f00'};">
                ${mod.enabled ? 'ON' : 'OFF'}
            </div>
        </div>
    `).join('');
    
    const selectedEl = list.querySelector('.mod-item.selected');
    if (selectedEl) selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

setTimeout(() => {
    injectModUI();
    preloadMods();
    
    // Intercept phase changing to support the new screen
    if (typeof changePhase === 'function') {
        const originalChangePhase = changePhase;
        changePhase = function(newPhase) {
            if (newPhase === 'mods') {
                gameState.phase = 'mods';
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                document.getElementById('screen-mods').classList.add('active');
                if (typeof playSound === 'function') playSound('blip');
                return;
            }
            originalChangePhase(newPhase);
        };
    }

    // Intercept standard button inputs (REWRITTEN: Removes Player 1 restrictions)
    if (typeof handleUIEvent === 'function') {
        const originalHandleUI = handleUIEvent;
        handleUIEvent = function(inputId, actionType) {
            
            // 1. Open Mods from Main Menu using Y button mapping (ccToggle) - Any Controller
            if (gameState.phase === 'menu' && actionType === 'ccToggle') {
                changePhase('mods');
                return;
            }
            
            // 2. Logic for Mod Manager Screen Navigation - Any Controller
            if (gameState.phase === 'mods') {
                if (actionType === 'up') {
                    modSelectionIdx = (modSelectionIdx - 1 + availableMods.length) % availableMods.length;
                    playSound('blip'); renderModList();
                } else if (actionType === 'down') {
                    modSelectionIdx = (modSelectionIdx + 1) % availableMods.length;
                    playSound('blip'); renderModList();
                } else if (actionType === 'action') {
                    if (availableMods.length > 0) {
                        availableMods[modSelectionIdx].enabled = !availableMods[modSelectionIdx].enabled;
                        playSound('blip'); renderModList();
                    }
                } else if (actionType === 'cancel' || actionType === 'start') {
                    // Save to local storage and force a hard refresh to apply session modifications
                    const disabled = availableMods.filter(m => !m.enabled).map(m => m.file);
                    localStorage.setItem('NeonGP_disabledMods', JSON.stringify(disabled));
                    playSound('ready');
                    setTimeout(() => location.reload(), 400); 
                }
                return; // Consume event
            }

            // 3. Global Pause Enable - Any Controller can pause during a race
            if (gameState.phase === 'racing' && actionType === 'start') {
                gameState.previousPhase = gameState.phase;
                changePhase('paused');
                return; // Consume event
            }
            
            // 4. Global Pause Menu Navigation - Any Controller (D-Pad, Sticks, A/B)
            if (gameState.phase === 'paused') {
                if (actionType === 'up' || actionType === 'down') {
                    gameState.pauseSelection = 1 - gameState.pauseSelection; 
                    playSound('blip');
                    updatePauseMenuUI();
                } else if (actionType === 'action') {
                    playSound('ready');
                    if (gameState.pauseSelection === 0) {
                        changePhase(gameState.previousPhase); // Resume
                    } else {
                        changePhase('menu'); // Quit
                    }
                } else if (actionType === 'cancel' || actionType === 'start') {
                    changePhase(gameState.previousPhase); // Cancel unpauses
                }
                return; // Consume event
            }
            
            // Fall back to base game logic for lobby readying and other untouched screens
            originalHandleUI(inputId, actionType);
        };
    }
    
    // Quick fix to bind 'M' key to the ccToggle (Y button) action natively for keyboard players
    if (typeof pollInput === 'function') {
        const originalPollInput = pollInput;
        pollInput = function() {
            originalPollInput();
            if (gameState.phase === 'menu') {
                const isMPressed = !!keys['KeyM'];
                if (isMPressed && !prevMKey) handleUIEvent(0, 'ccToggle');
                prevMKey = isMPressed;
            }
        };
    }
}, 800);
