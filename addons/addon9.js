// addons/addon9.js - Vehicle Expansion (Porsche & Miata)
// Overwrites the car loader boundaries safely to add beautiful new vectors.

const porscheSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
    <rect x="5" y="130" width="20" height="40" rx="4" fill="#111"/><rect x="75" y="130" width="20" height="40" rx="4" fill="#111"/>
    <rect x="8" y="30" width="15" height="35" rx="3" fill="#111"/><rect x="77" y="30" width="15" height="35" rx="3" fill="#111"/>
    <path d="M 30 10 Q 50 5 70 10 C 85 20, 95 60, 95 100 C 95 140, 90 180, 85 190 Q 50 195 15 190 C 10 180, 5 140, 5 100 C 5 60, 15 20, 30 10 Z" fill="VAR_COLOR"/>
    <path d="M 22 75 C 50 55, 78 75, 80 115 C 50 145, 20 115, 22 75 Z" fill="#111"/>
    <circle cx="23" cy="35" r="8" fill="#fff"/><circle cx="77" cy="35" r="8" fill="#fff"/>
    <rect x="10" y="180" width="80" height="4" rx="2" fill="#f00"/>
</svg>`;

const miataSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
    <rect x="10" y="35" width="15" height="35" rx="4" fill="#111"/><rect x="75" y="35" width="15" height="35" rx="4" fill="#111"/>
    <rect x="10" y="135" width="15" height="35" rx="4" fill="#111"/><rect x="75" y="135" width="15" height="35" rx="4" fill="#111"/>
    <path d="M 25 25 Q 50 18 75 25 C 85 30, 88 50, 88 100 C 88 150, 85 170, 75 180 Q 50 185 25 180 C 15 170, 12 150, 12 100 C 12 50, 15 30, 25 25 Z" fill="VAR_COLOR"/>
    <rect x="22" y="32" width="14" height="12" rx="2" fill="#222"/><rect x="23" y="35" width="12" height="6" rx="2" fill="#fff"/>
    <rect x="64" y="32" width="14" height="12" rx="2" fill="#222"/><rect x="65" y="35" width="12" height="6" rx="2" fill="#fff"/>
    <path d="M 20 85 Q 50 70 80 85 L 75 130 Q 50 140 25 130 Z" fill="#111"/>
    <rect x="25" y="90" width="20" height="25" rx="5" fill="#333"/><rect x="55" y="90" width="20" height="25" rx="5" fill="#333"/>
    <rect x="18" y="175" width="20" height="8" rx="4" fill="#f00"/><rect x="62" y="175" width="20" height="8" rx="4" fill="#f00"/>
</svg>`;

setTimeout(() => {
    // 1. Hook getCarSVG to inject our custom SVGs seamlessly
    if (typeof getCarSVG === 'function') {
        const originalGetCar = getCarSVG;
        window.getCarSVG = function(modelIdx, colorHex) {
            if (modelIdx === 4) return createAddonCarSVG(porscheSVG, colorHex, '4');
            if (modelIdx === 5) return createAddonCarSVG(miataSVG, colorHex, '5');
            return originalGetCar(modelIdx, colorHex);
        }
    }
    
    // Cache helper for addon cars
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
                    if (p.carModel === 4) name.innerText = 'PORSCHE 911';
                    if (p.carModel === 5) name.innerText = 'MAZDA MIATA';
                }
            });
        }
        
        // Trigger a refresh instantly in case they loaded while in the lobby
        if (gameState && gameState.phase === 'lobby') window.updateLobbyUI();
    }
}, 1200);
