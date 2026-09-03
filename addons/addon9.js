// addons/addon9.js - Vehicle Expansion Pack (Porsche & Miata)
// Overrides the base game's hardcoded car limits and injects two new highly detailed SVG vehicles.

setTimeout(() => {
    // 1. Expand the base game's model registry if it exists in the scope
    if (typeof CAR_MODELS !== 'undefined') {
        CAR_MODELS.push('PORSCHE 911', 'MAZDA MIATA');
    }

    // 2. Monkey-patch the input handler to fix the hardcoded modulo math (which originally locked to 4 cars)
    if (typeof handleUIEvent === 'function') {
        const origHandleUI = handleUIEvent;
        window.handleUIEvent = function(inputId, actionType) {
            const p = players.find(x => x.inputId === inputId);
            
            if (typeof gameState !== 'undefined' && gameState.phase === 'lobby' && p && !p.ready) {
                // Dynamically fetch the real length in case other mods add even more cars
                const maxCars = typeof CAR_MODELS !== 'undefined' ? CAR_MODELS.length : 6; 
                
                if (actionType === 'left') {
                    p.carModel = (p.carModel + maxCars - 1) % maxCars;
                    if (typeof playSound === 'function') playSound('blip');
                    if (typeof updateLobbyUI === 'function') updateLobbyUI();
                    return; // Prevent original function from running and snapping back to 4
                }
                if (actionType === 'right') {
                    p.carModel = (p.carModel + 1) % maxCars;
                    if (typeof playSound === 'function') playSound('blip');
                    if (typeof updateLobbyUI === 'function') updateLobbyUI();
                    return; // Prevent original function from running
                }
            }
            // Fallback for readying up, steering, pauses, etc.
            origHandleUI(inputId, actionType);
        };
    }

    // 3. Monkey-patch the rendering engine's image generator to build our new SVGs
    if (typeof getCarSVG === 'function') {
        const origGetCarSVG = window.getCarSVG;
        const customCarCache = {};
        
        window.getCarSVG = function(modelIdx, colorHex) {
            // Intercept our new custom vehicle indices
            if (modelIdx >= 4) {
                const key = `${modelIdx}_${colorHex}`;
                if (customCarCache[key]) return customCarCache[key]; // Return cached image for performance
                
                let svg = '';
                
                if (modelIdx === 4) {
                    // --- PORSCHE 911 ---
                    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
                        <!-- Wider Rear Tires -->
                        <rect x="5" y="30" width="20" height="40" rx="6" fill="#050505"/>
                        <rect x="75" y="30" width="20" height="40" rx="6" fill="#050505"/>
                        <rect x="0" y="125" width="28" height="45" rx="6" fill="#050505"/>
                        <rect x="72" y="125" width="28" height="45" rx="6" fill="#050505"/>
                        <!-- Curvy Main Chassis -->
                        <path d="M 32 10 Q 50 5 68 10 C 85 20, 88 50, 88 80 C 88 120, 95 140, 93 185 C 92 195, 50 195, 50 195 C 50 195, 8 195, 7 185 C 5 140, 12 120, 12 80 C 12 50, 15 20, 32 10 Z" fill="${colorHex}"/>
                        <!-- Aggressive Sloped Windshield & Roof -->
                        <path d="M 22 75 C 50 55, 78 75, 80 115 C 50 145, 20 115, 22 75 Z" fill="#0a0a0f"/>
                        <path d="M 28 80 C 50 68, 72 80, 74 110 C 50 130, 26 110, 28 80 Z" fill="#151520"/>
                        <!-- Iconic Round Headlights -->
                        <circle cx="23" cy="35" r="8" fill="#fff"/>
                        <circle cx="77" cy="35" r="8" fill="#fff"/>
                        <circle cx="23" cy="35" r="5" fill="#e0f7fa"/>
                        <circle cx="77" cy="35" r="5" fill="#e0f7fa"/>
                        <!-- Subtle Hood Creases -->
                        <path d="M 32 15 C 34 30, 32 50, 32 50" stroke="#000" stroke-width="2" opacity="0.3" fill="none"/>
                        <path d="M 68 15 C 66 30, 68 50, 68 50" stroke="#000" stroke-width="2" opacity="0.3" fill="none"/>
                        <!-- Rear Engine Grille -->
                        <rect x="40" y="160" width="20" height="15" rx="2" fill="#111"/>
                        <rect x="42" y="162" width="16" height="2" fill="#333"/>
                        <rect x="42" y="166" width="16" height="2" fill="#333"/>
                        <rect x="42" y="170" width="16" height="2" fill="#333"/>
                        <!-- Connected Taillight Bar -->
                        <rect x="10" y="182" width="80" height="4" rx="2" fill="#ff0000"/>
                        <rect x="15" y="183" width="70" height="2" fill="#ffaa00" opacity="0.5"/>
                    </svg>`;
                } 
                else if (modelIdx === 5) {
                    // --- MAZDA MIATA (NA) ---
                    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
                        <!-- Compact Tires -->
                        <rect x="8" y="32" width="18" height="36" rx="5" fill="#050505"/>
                        <rect x="74" y="32" width="18" height="36" rx="5" fill="#050505"/>
                        <rect x="8" y="132" width="18" height="36" rx="5" fill="#050505"/>
                        <rect x="74" y="132" width="18" height="36" rx="5" fill="#050505"/>
                        <!-- Rounded Chassis -->
                        <path d="M 26 22 Q 50 16 74 22 C 84 28, 86 50, 86 90 C 86 130, 86 160, 80 182 C 78 190, 50 190, 50 190 C 50 190, 22 190, 20 182 C 14 160, 14 130, 14 90 C 14 50, 16 28, 26 22 Z" fill="${colorHex}"/>
                        <!-- Pop-up Headlights (Open) -->
                        <rect x="22" y="30" width="14" height="12" rx="2" fill="#111"/>
                        <rect x="23" y="33" width="12" height="6" rx="2" fill="#fff"/>
                        <rect x="64" y="30" width="14" height="12" rx="2" fill="#111"/>
                        <rect x="65" y="33" width="12" height="6" rx="2" fill="#fff"/>
                        <!-- Windshield Frame -->
                        <path d="M 18 80 Q 50 65 82 80 L 78 84 Q 50 72 22 84 Z" fill="#fff" opacity="0.8"/>
                        <!-- Open-Top Interior Cavity -->
                        <path d="M 22 84 Q 50 72 78 84 C 78 100, 76 130, 72 135 C 50 145, 28 135, 28 135 C 24 130, 22 100, 22 84 Z" fill="#111"/>
                        <!-- Detailed Driver & Passenger Seats -->
                        <rect x="28" y="90" width="16" height="28" rx="4" fill="#2a2a2a"/>
                        <rect x="30" y="85" width="12" height="8" rx="2" fill="#151515"/>
                        <rect x="56" y="90" width="16" height="28" rx="4" fill="#2a2a2a"/>
                        <rect x="58" y="85" width="12" height="8" rx="2" fill="#151515"/>
                        <!-- Steering Wheel Column -->
                        <circle cx="36" cy="85" r="6" fill="#333"/>
                        <rect x="34" y="83" width="4" height="4" fill="#111"/>
                        <!-- Pill-Shaped Taillights with Indicators -->
                        <rect x="18" y="178" width="22" height="8" rx="4" fill="#cc0000"/>
                        <rect x="60" y="178" width="22" height="8" rx="4" fill="#cc0000"/>
                        <circle cx="24" cy="182" r="3" fill="#ffaa00"/>
                        <circle cx="76" cy="182" r="3" fill="#ffaa00"/>
                    </svg>`;
                }
                
                if (svg) {
                    const uri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
                    const img = new Image();
                    img.src = uri;
                    customCarCache[key] = img;
                    return img;
                }
            }
            
            // Let the base engine handle indices 0 through 3 natively
            return origGetCarSVG(modelIdx, colorHex);
        };
    }

    // 4. Force UI to display fallback names if the CAR_MODELS array wasn't globally mutable
    if (typeof updateLobbyUI === 'function') {
        const origUpdateLobbyUI = window.updateLobbyUI;
        window.updateLobbyUI = function() {
            origUpdateLobbyUI(); // Run original renderer
            
            // Post-process any slots utilizing our new vehicles to ensure names don't display as "undefined"
            players.forEach((p, i) => {
                const nameEl = document.getElementById(`name-slot-${i}`);
                if (nameEl) {
                    if (p.carModel === 4) nameEl.innerText = 'PORSCHE 911';
                    if (p.carModel === 5) nameEl.innerText = 'MAZDA MIATA';
                }
            });
        };
    }

}, 1200); // Trigger slightly after standard UI loaders to ensure overrides catch
