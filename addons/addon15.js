// addons/addon10.js - Vehicle Expansion Pack 3
// Adds the Tron-inspired Neon Runner, Time Machine, Lowrider, and Apocalypse Buggy.

const tronSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
    <rect x="15" y="25" width="10" height="40" rx="3" fill="#000"/>
    <rect x="75" y="25" width="10" height="40" rx="3" fill="#000"/>
    <rect x="15" y="140" width="10" height="40" rx="3" fill="#000"/>
    <rect x="75" y="140" width="10" height="40" rx="3" fill="#000"/>
    <!-- Sleek OLED Black Body -->
    <path d="M 25 20 Q 50 10 75 20 L 85 100 L 75 180 Q 50 190 25 180 L 15 100 Z" fill="#0a0a0c"/>
    <!-- Neon Glow Lines linked to VAR_COLOR -->
    <path d="M 30 25 L 30 175 M 70 25 L 70 175 M 40 15 L 50 5 L 60 15 M 50 5 L 50 185" stroke="VAR_COLOR" stroke-width="3" fill="none" opacity="0.9"/>
    <circle cx="50" cy="100" r="15" stroke="VAR_COLOR" stroke-width="2" fill="#000" opacity="0.9"/>
    <circle cx="50" cy="100" r="8" fill="VAR_COLOR" opacity="0.7"/>
</svg>`;

const deloreanSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
    <rect x="10" y="30" width="14" height="35" rx="2" fill="#111"/>
    <rect x="76" y="30" width="14" height="35" rx="2" fill="#111"/>
    <rect x="10" y="140" width="14" height="35" rx="2" fill="#111"/>
    <rect x="76" y="140" width="14" height="35" rx="2" fill="#111"/>
    <!-- Tintable Base Body -->
    <path d="M 22 25 L 78 25 L 85 185 L 15 185 Z" fill="VAR_COLOR"/>
    <!-- Stainless Steel Overlays -->
    <path d="M 25 28 L 75 28 L 82 182 L 18 182 Z" fill="#b0b5b9" opacity="0.7"/>
    <!-- Front Bumper & Headlights -->
    <rect x="18" y="20" width="64" height="8" fill="#333"/>
    <rect x="22" y="22" width="12" height="4" fill="#fff"/>
    <rect x="66" y="22" width="12" height="4" fill="#fff"/>
    <!-- Windshield & Roof -->
    <path d="M 25 75 L 75 75 L 70 115 L 30 115 Z" fill="#151e29"/>
    <rect x="28" y="115" width="44" height="30" fill="#b0b5b9"/>
    <!-- Rear Vents -->
    <rect x="25" y="145" width="50" height="35" fill="#222"/>
    <path d="M 30 150 L 70 150 M 30 155 L 70 155 M 30 160 L 70 160 M 30 165 L 70 165" stroke="#777" stroke-width="2"/>
    <!-- Flux Bands -->
    <path d="M 15 130 L 25 145 L 75 145 L 85 130" stroke="#4bc4e6" stroke-width="2" fill="none"/>
</svg>`;

const lowriderSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
    <!-- Whitewall Wire Wheels -->
    <rect x="10" y="25" width="12" height="40" rx="6" fill="#111" stroke="#fff" stroke-width="2"/>
    <rect x="78" y="25" width="12" height="40" rx="6" fill="#111" stroke="#fff" stroke-width="2"/>
    <rect x="10" y="140" width="12" height="40" rx="6" fill="#111" stroke="#fff" stroke-width="2"/>
    <rect x="78" y="140" width="12" height="40" rx="6" fill="#111" stroke="#fff" stroke-width="2"/>
    <!-- Long Boat-like Body -->
    <path d="M 18 15 Q 50 10 82 15 L 85 190 Q 50 195 15 190 Z" fill="VAR_COLOR"/>
    <!-- Chrome Bumpers -->
    <path d="M 16 13 Q 50 8 84 13" stroke="#e0e0e0" stroke-width="4" fill="none"/>
    <path d="M 13 192 Q 50 197 87 192" stroke="#e0e0e0" stroke-width="4" fill="none"/>
    <!-- Roof and Cab -->
    <path d="M 22 75 Q 50 70 78 75 L 74 130 Q 50 135 26 130 Z" fill="#fff" opacity="0.8"/>
    <!-- Custom Pinstriping -->
    <path d="M 25 20 Q 50 40 75 20 M 25 185 Q 50 165 75 185" stroke="#ffd700" stroke-width="1.5" fill="none"/>
</svg>`;

const buggySVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
    <!-- Giant Chunky Off-road Tires -->
    <rect x="5" y="20" width="22" height="45" rx="5" fill="#1a1a1a" stroke="#000" stroke-width="2" stroke-dasharray="4 2"/>
    <rect x="73" y="20" width="22" height="45" rx="5" fill="#1a1a1a" stroke="#000" stroke-width="2" stroke-dasharray="4 2"/>
    <rect x="5" y="135" width="22" height="45" rx="5" fill="#1a1a1a" stroke="#000" stroke-width="2" stroke-dasharray="4 2"/>
    <rect x="73" y="135" width="22" height="45" rx="5" fill="#1a1a1a" stroke="#000" stroke-width="2" stroke-dasharray="4 2"/>
    <!-- Tintable Main Chassis -->
    <path d="M 25 15 L 75 15 L 70 185 L 30 185 Z" fill="VAR_COLOR"/>
    <!-- Rusted Dirt Overlay -->
    <path d="M 25 15 L 75 15 L 70 185 L 30 185 Z" fill="#5c4033" opacity="0.6"/>
    <!-- Exposed Roll Cage -->
    <path d="M 30 30 L 70 30 L 65 140 L 35 140 Z" stroke="#888" stroke-width="4" fill="none"/>
    <path d="M 30 30 L 65 140 M 70 30 L 35 140" stroke="#888" stroke-width="3" fill="none"/>
    <!-- Armor Plates and Spikes -->
    <rect x="35" y="15" width="30" height="15" fill="#444"/>
    <path d="M 15 90 L 25 85 L 25 95 Z M 85 90 L 75 85 L 75 95 Z" fill="#999"/>
    <path d="M 20 180 L 30 195 L 40 180 M 60 180 L 70 195 L 80 180" fill="#777"/>
</svg>`;

// We dynamically push our new cars to the global CAR_MODELS array!
// This ensures compatibility with disabled addons and fixes the hardcoded % 4 limit.
const startIdx = CAR_MODELS.length;
CAR_MODELS.push('NEON RUNNER', 'TIME MACHINE', 'LOWRIDER', 'APOC BUGGY');

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

if (typeof getCarSVG === 'function') {
    const originalGetCar = getCarSVG;
    window.getCarSVG = function(modelIdx, colorHex) {
        if (modelIdx === startIdx) return createAddonCarSVG(tronSVG, colorHex, 'neon');
        if (modelIdx === startIdx + 1) return createAddonCarSVG(deloreanSVG, colorHex, 'time');
        if (modelIdx === startIdx + 2) return createAddonCarSVG(lowriderSVG, colorHex, 'low');
        if (modelIdx === startIdx + 3) return createAddonCarSVG(buggySVG, colorHex, 'apoc');
        
        // Pass all other indices back down the chain
        return originalGetCar(modelIdx, colorHex);
    }
}

if (typeof handleUIEvent === 'function') {
    const originalUI = handleUIEvent;
    window.handleUIEvent = function(inputId, actionType) {
        const p = players.find(x => x.inputId === inputId);
        
        // We intercept here to enforce the dynamic maximum of CAR_MODELS.length
        if (gameState.phase === 'lobby' && p && !p.ready) {
            if (actionType === 'left') { 
                p.carModel = (p.carModel + CAR_MODELS.length - 1) % CAR_MODELS.length; 
                if(typeof playSound==='function') playSound('blip'); 
                if(typeof updateLobbyUI === 'function') updateLobbyUI();
                return; 
            }
            if (actionType === 'right') { 
                p.carModel = (p.carModel + 1) % CAR_MODELS.length; 
                if(typeof playSound==='function') playSound('blip'); 
                if(typeof updateLobbyUI === 'function') updateLobbyUI();
                return;
            }
        }
        
        originalUI(inputId, actionType);
    }
}

// We no longer need to patch updateLobbyUI just to set the names, 
// nor do we need a timeout. The base game natively uses CAR_MODELS[p.carModel]!
