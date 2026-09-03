// addons/addon12.js - Audio Expansion Pack
// Expands the race soundtrack to include songs 6 through 10.
// Aggressively unbinds previous playlist logic to guarantee the new tracks play.

setTimeout(() => {
    if (typeof raceMusic !== 'undefined') {
        
        // Clean up any old listeners bound by the base game or addon11
        if (typeof playNextRaceSong === 'function') {
            raceMusic.removeEventListener('ended', playNextRaceSong);
        }
        if (window.playNextRaceSong) {
            raceMusic.removeEventListener('ended', window.playNextRaceSong);
        }

        window.playNextRaceSong = function() {
            // Ensure global playlist array exists
            if (typeof songPlaylist === 'undefined') window.songPlaylist = [];
            
            // If the playlist is empty, refill it with songs 1 through 10
            if (songPlaylist.length === 0) {
                for (let i = 1; i <= 10; i++) {
                    songPlaylist.push(i);
                }
                
                // Shuffle the array flawlessly
                for (let i = songPlaylist.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [songPlaylist[i], songPlaylist[j]] = [songPlaylist[j], songPlaylist[i]];
                }
                
                // Prevent the last played song from playing immediately again
                if (typeof lastPlayedSong !== 'undefined' && songPlaylist[0] === lastPlayedSong && songPlaylist.length > 1) {
                    [songPlaylist[0], songPlaylist[1]] = [songPlaylist[1], songPlaylist[0]];
                }
            }
            
            // Grab the next song from the shuffled queue
            const nextSong = songPlaylist.shift();
            window.lastPlayedSong = nextSong;
            
            // The filename will match exactly: audio/song1.mp3 through audio/song10.mp3
            raceMusic.src = `audio/song${nextSong}.mp3`;
            raceMusic.play().catch(e => console.warn(`Audio expansion file missing: audio/song${nextSong}.mp3`, e));
        };

        // Bind the newly expanded playlist controller
        raceMusic.addEventListener('ended', window.playNextRaceSong);
    }
}, 1500); // 1500ms delay ensures it successfully overrides the base game and addon11
