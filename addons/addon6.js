// addons/addon6.js - Switch UI Overhaul
// Overhauls the entire menu system to a professional, responsive, Nintendo Switch-inspired AAA interface.

const injectUIStyles = () => {
    const style = document.createElement('style');
    style.id = 'switch-ui-styles';
    style.innerHTML = `
        /* Root Theme Overrides */
        :root {
            --nx-dark: #2b2b2b;
            --nx-darker: #1e1e1e;
            --nx-light: #ebebeb;
            --nx-red: #e60012;
            --nx-cyan: #00ffff;
            --nx-focus: #00ffcc;
        }

        /* Clean up the background */
        #bg-grid { opacity: 0.3; }
        body, html { background: var(--nx-darker); }

        /* Typography Scaling (Ensures it fits on all screens) */
        h1 { 
            font-size: clamp(3rem, 7vmin, 6rem); 
            letter-spacing: 2px; 
            text-shadow: none; 
            color: var(--nx-light);
            border-bottom: 4px solid var(--nx-red);
            padding-bottom: 10px;
            display: inline-block;
            margin-bottom: 1vh;
        }
        h2 { 
            font-size: clamp(1.5rem, 4vmin, 3rem); 
            letter-spacing: 2px; 
            color: #aaa; 
            margin-bottom: 3vh; 
            text-shadow: none;
            font-weight: 800;
        }

        /* Screen Layouts - Forced to Viewport limits */
        .screen {
            padding: 4vh 4vw 10vh 4vw; /* Leave room for footer */
            justify-content: flex-start;
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(12px);
        }
        
        #screen-menu { justify-content: center; }

        /* Sleek Switch-style Player Cards */
        .lobby-container {
            display: flex;
            gap: 1.5vw;
            width: 100%;
            max-width: 1400px;
            height: 55vh; /* Responsive height */
            min-height: 300px;
            margin: 0 auto;
        }

        .player-slot {
            flex: 1;
            height: 100%;
            background: var(--nx-dark);
            border: 4px solid transparent;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            justify-content: flex-start;
            padding: 2vh 1vw;
        }

        .player-slot.active {
            background: #333;
            border-color: var(--p-color);
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.5), 0 0 0 4px rgba(255,255,255,0.1);
        }

        /* Tweak internals of the player card to scale perfectly */
        .player-slot .p-header {
            font-size: clamp(1.5rem, 4vmin, 2.5rem);
            margin-bottom: 2vh;
            border-bottom: 2px solid #444;
            width: 100%;
            padding-bottom: 10px;
            text-align: center;
        }

        .car-display {
            height: 40%;
            margin-bottom: 2vh;
        }

        .car-name, .special-name {
            font-size: clamp(0.7rem, 1.5vmin, 1.2rem);
            height: auto;
            margin-bottom: 1vh;
        }

        .player-slot .status-box {
            margin-top: auto;
            border-radius: 6px;
            font-size: clamp(0.6rem, 1.2vmin, 1rem);
            background: #222;
        }

        /* Hide the old clunky controls box completely */
        .controls-box { display: none !important; }

        /* The Global Switch Footer */
        #nx-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 8vh;
            min-height: 50px;
            background: #111;
            border-top: 1px solid #333;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0 4vw;
            z-index: 1000;
            gap: 2vw;
            font-size: clamp(0.7rem, 1.5vmin, 1rem);
            font-weight: 800;
            color: #aaa;
        }

        .nx-prompt-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .nx-prompt-item .btn-prompt {
            box-shadow: none;
            border: 2px solid #555;
            background: #222;
            color: #fff;
            border-radius: 50%;
            width: clamp(24px, 4vmin, 32px);
            height: clamp(24px, 4vmin, 32px);
            font-size: clamp(0.7rem, 1.5vmin, 1rem);
        }
        
        .nx-prompt-item .btn-prompt.pill {
            border-radius: 16px;
            width: auto;
            padding: 0 10px;
        }

        /* Pause Menu Overhaul */
        .menu-panel {
            background: var(--nx-dark);
            border: none;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8);
            border-radius: 12px;
        }

        .menu-item {
            border-left: 6px solid transparent;
            border-radius: 4px;
            color: var(--nx-light);
        }

        .menu-item.selected {
            background: #444;
            border-left-color: var(--nx-focus);
            color: #fff;
            transform: scale(1.02);
            box-shadow: 0 0 0 2px var(--nx-focus);
        }
        
        /* Specific adjustments to tables so they don't overflow */
        .standings-table {
            width: 90%;
            max-width: 1000px;
        }
        .standings-table td {
            font-size: clamp(1rem, 2.5vmin, 1.5rem);
            padding: 2vh 2vw;
        }
    `;
    document.head.appendChild(style);
};

const initGlobalFooter = () => {
    if (!document.getElementById('nx-footer')) {
        const footer = document.createElement('div');
        footer.id = 'nx-footer';
        document.body.appendChild(footer);
    }
};

const updateFooterPrompts = (phase) => {
    const footer = document.getElementById('nx-footer');
    if (!footer) return;

    let html = '';
    
    // Helper to generate prompt items
    const prompt = (btn, text, isPill = false) => `
        <div class="nx-prompt-item">
            <span class="btn-prompt ${isPill ? 'pill' : ''}">${btn}</span>
            <span>${text}</span>
        </div>
    `;

    // Dynamic contextual buttons based on the game screen
    if (phase === 'menu') {
        html += prompt('Y', 'MODS');
        html += prompt('A', 'START');
    } 
    else if (phase === 'lobby') {
        // Integrate the hint from addon1 (Camera Toggle) if it exists globally
        if (window.NeonGP && typeof window.NeonGP.arcadeCamera !== 'undefined') {
            html += prompt('VIEW', 'CAMERA', true);
        }
        html += prompt('LB/RB', 'COLOR', true);
        html += prompt('Y', 'SPEED CLASS');
        html += prompt('B', 'LEAVE');
        html += prompt('A', 'JOIN / READY');
    }
    else if (phase === 'mods') {
        html += prompt('B', 'SAVE & RESTART');
        html += prompt('A', 'TOGGLE MOD');
    }
    else if (phase === 'paused') {
        html += prompt('A', 'CONFIRM');
    }
    else if (phase === 'standings' || phase === 'podium' || phase === 'leaderboard') {
        html += prompt('A', 'CONTINUE');
    }
    // Clear footer during races
    else if (phase === 'race_intro' || phase === 'racing') {
        html = '';
    }

    footer.innerHTML = html;
};

setTimeout(() => {
    injectUIStyles();
    initGlobalFooter();

    // 1. Monkey-patch the changePhase function to update the footer dynamically
    if (typeof changePhase === 'function') {
        const originalChangePhase = changePhase;
        changePhase = function(newPhase) {
            originalChangePhase(newPhase); // Run base game logic
            updateFooterPrompts(newPhase); // Run our new UI logic
        };
        // Trigger for the initial load
        if (typeof gameState !== 'undefined') updateFooterPrompts(gameState.phase);
    }
    
    // 2. Adjust addon1 (Camera) if it exists, since we hid the .controls-box it usually injects into
    if (typeof initCameraAddon === 'function') {
        // Redefine it to do nothing since our footer handles the hint now
        initCameraAddon = () => {}; 
    }
    
}, 800);
