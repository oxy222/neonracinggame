// addons/addon9.js - Vehicle Expansion (Dodge Charger & Mazda Miata)
// Overwrites the car loader boundaries safely to add beautiful new vectors.

const chargerSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
    <!-- Wide Tires -->
    <rect x="5" y="25" width="20" height="45" rx="5" fill="#111"/>
    <rect x="75" y="25" width="20" height="45" rx="5" fill="#111"/>
    <rect x="5" y="135" width="20" height="45" rx="5" fill="#111"/>
    <rect x="75" y="135" width="20" height="45" rx="5" fill="#111"/>
    <!-- Muscular Main Body -->
    <path d="M 12 20 Q 50 15 88 20 C 95 30, 95 160, 88 185 Q 50 190 12 185 C 5 160, 5 30, 12 20 Z" fill="VAR_COLOR"/>
    <!-- Hood Vents & Scoop -->
    <rect x="30" y="25" width="40" height="45" rx="5" fill="#222" opacity="0.3"/>
    <rect x="35" y="30" width="30" height="25" rx="3" fill="#111"/> 
    <rect x="37" y="32" width="26" height="4" fill="#000"/>
    <!-- Front Grille & Lights -->
    <rect x="15" y="18" width="70" height="8" rx="2" fill="#111"/>
    <circle cx="22" cy="22" r="3" fill="#ffdd00"/>
    <circle cx="28" cy="22" r="3" fill="#ffdd00"/>
    <circle cx="72" cy="22" r="3" fill="#ffdd00"/>
    <circle cx="78" cy="22" r="3" fill="#ffdd00"/>
    <!-- Windshield -->
    <path d="M 18 75 Q 50 65 82 75 L 78 115 Q 50 110 22 115 Z" fill="#111"/>
    <!-- Roof -->
    <rect x="22" y="82" width="56" height="50" rx="4" fill="VAR_COLOR"/>
    <!-- Rear Window -->
    <path d="M 24 135 Q 50 130 76 135 L 82 165 Q 50 160 18 165 Z" fill="#111"/>
    <!-- Rear Spoiler -->
    <rect x="12" y="173" width="76" height="8" rx="3" fill="#111"/>
    <rect x="15" y="175" width="70" height="4" rx="2" fill="#222"/>
    <!-- Signature Charger Taillight Bar -->
    <rect x="15" y="184" width="70" height="4" rx="2" fill="#f00"/>
    <!-- Side Mirrors -->
    <path d="M 10 80 L 5 80 L 5 70 Z" fill="#222"/>
    <path d="M 90 80 L 95 80 L 95 70 Z" fill="#222"/>
</svg>`;

const miataSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
    <!-- Tires -->
    <rect x="12" y="30" width="15" height="35" rx="4" fill="#0a0a0a"/>
    <rect x="73" y="30" width="15" height="35" rx="4" fill="#0a0a0a"/>
    <rect x="12" y="140" width="15" height="35" rx="4" fill="#0a0a0a"/>
    <rect x="73" y="140" width="15" height="35" rx="4" fill="#0a0a0a"/>
    <!-- Main Body Curves -->
    <path d="M 25 20 Q 50 12 75 20 C 88 28, 92 60, 90 100 C 88 150, 85 175, 75 185 Q 50 190 25 185 C 15 175, 12 150, 10 100 C 8 60, 12 28, 25 20 Z" fill="VAR_COLOR"/>
    <!-- Hood Lines -->
    <path d="M 35 25 Q 30 50 35 80 M 65 25 Q 70 50 65 80" stroke="#000" stroke-width="1.5" stroke-opacity="0.3" fill="none"/>
    <!-- Iconic Pop-up Headlights (Open) -->
    <rect x="22" y="28" width="16" height="14" rx="3" fill="VAR_COLOR"/>
    <rect x="23" y="29" width="14" height="12" rx="2" fill="#111"/>
    <rect x="24" y="32" width="12" height="6" rx="3" fill="#fff" opacity="0.9"/>
    <rect x="62" y="28" width="16" height="14" rx="3" fill="VAR_COLOR"/>
    <rect x="63" y="29" width="14" height="12" rx="2" fill="#111"/>
    <rect x="64" y="32" width="12" height="6" rx="3" fill="#fff" opacity="0.9"/>
    <!-- Front Grille (Smiley Face) -->
    <path d="M 35 15 Q 50 22 65 15" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none"/>
    <!-- Windshield -->
    <path d="M 18 85 Q 50 70 82 85 L 76 100 Q 50 95 24 100 Z" fill="#151520"/>
    <!-- Open Cabin / Interior -->
    <path d="M 22 100 Q 50 95 78 100 L 75 150 Q 50 160 25 150 Z" fill="#2a2a30"/>
    <!-- Seats -->
    <rect x="28" y="115" width="18" height="25" rx="6" fill="#111"/>
    <rect x="54" y="115" width="18" height="25" rx="6" fill="#111"/>
    <!-- Steering Wheel -->
    <circle cx="37" cy="110" r="6" stroke="#444" stroke-width="2" fill="none"/>
    <rect x="36" y="110" width="2" height="6" fill="#444"/>
    <!-- Chrome Roll Hoops -->
    <path d="M 28 145 Q 37 130 46 145 M 54 145 Q 63 130 72 145" stroke="#ccc" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Side Mirrors -->
    <path d="M 15 85 L 8 85 L 12 78 Z" fill="VAR_COLOR"/>
    <path d="M 85 85 L 92 85 L 88 78 Z" fill="VAR_COLOR"/>
    <!-- Trunk Outline -->
    <path d="M 25 155 Q 50 160 75 155 L 70 180 Q 50 185 30 180 Z" stroke="#000" stroke-width="1.5" stroke-opacity="0.2" fill="none"/>
    <!-- Taillights -->
    <rect x="18" y="180" width="20" height="7" rx="3" fill="#f00"/>
    <rect x="62" y="180" width="20" height="7" rx="3" fill="#f00"/>
    <!-- Exhaust Pipe -->
    <circle cx="75" cy="190" r="3" fill="#666"/>
</svg>`;

setTimeout(() => {
    // 1. Hook getCarSVG to inject our custom SVGs seamlessly
    if (typeof getCarSVG === 'function') {
        const originalGetCar = getCarSVG;
        window.getCarSVG = function(modelIdx, colorHex) {
            if (modelIdx === 4) return createAddonCarSVG(chargerSVG, colorHex, '4');
            if (modelIdx === 5) return createAddonCarSVG(miataSVG, colorHex, '5');
            return originalGetCar(modelIdx, colorHex);
        }
    }
    
    // Cache helper for addon cars to ensure performance isn't impacted
    const addonCarCache = {};
    function createAddonCarSVG(svgTpl, color, id) {
        const key = `${id}_${color}`;
        if (addonCarCache[key]) return addonCarCache[key];
        const finalSVG = svgTpl.replace(/VAR_COLOR/g, color);
        const img = new Image();
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(finalSVG);
        addonCarCache[key] = img;
        return img;
    }

    // 2. Override handleUIEvent to expand the Car Selection bounds from 4 to 6
    if (typeof handleUIEvent === 'function') {
        const originalUI = handleUIEvent;
        window.handleUIEvent = function(inputId, actionType) {
            const p = players.find(x => x.inputId === inputId);
            
            // Intercept Left/Right in lobby before original function clamps to % 4
            if (gameState.phase === 'lobby' && p && !p.ready) {
                if (actionType === 'left') { 
                    p.carModel = (p.carModel + 5) % 6; 
                    if(typeof playSound==='function') playSound('blip'); 
                    if(typeof updateLobbyUI === 'function') updateLobbyUI();
                    return; // Halt to prevent base game from executing
                }
                if (actionType === 'right') { 
                    p.carModel = (p.carModel + 1) % 6; 
                    if(typeof playSound==='function') playSound('blip'); 
                    if(typeof updateLobbyUI === 'function') updateLobbyUI();
                    return; // Halt to prevent base game from executing
                }
            }
            
            // Allow all other actions to flow naturally
            originalUI(inputId, actionType);
        }
    }
    
    // 3. Update the names in the lobby rendering
    if (typeof updateLobbyUI === 'function') {
        const origLobby = updateLobbyUI;
        window.updateLobbyUI = function() {
            origLobby();
            players.forEach((p, i) => {
                const name = document.getElementById(`name-slot-${i}`);
                if (name && p.joined) {
                    if (p.carModel === 4) name.innerText = 'DODGE CHARGER';
                    if (p.carModel === 5) name.innerText = 'MAZDA MIATA';
                }
            });
        }
        
        // Trigger a refresh instantly in case they loaded while in the lobby
        if (gameState && gameState.phase === 'lobby') window.updateLobbyUI();
    }
}, 1200);
