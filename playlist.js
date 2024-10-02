let playlists = JSON.parse(localStorage.getItem('playlists')) || {};

function updatePlaylistList() {
    const playlistList = document.getElementById('playlistList');
    playlistList.innerHTML = '';
    for (const name in playlists) {
        const playlistCard = document.createElement('div');
        playlistCard.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';
        playlistCard.innerHTML = `
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2 truncate">${name}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${playlists[name].length} songs</p>
                <div class="flex flex-wrap gap-2">
                    <button class="bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-600" onclick="playPlaylist('${name}')">Play</button>
                    <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600" onclick="showPlaylistSongs('${name}')">View</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600" onclick="deletePlaylist('${name}')">Delete</button>
                </div>
            </div>
        `;
        playlistList.appendChild(playlistCard);
    }
    
    // Update playlist select options
    updatePlaylistSelectOptions();
}

function updatePlaylistSelectOptions() {
    const playlistSelects = document.querySelectorAll('.playlist-select');
    playlistSelects.forEach(select => {
        select.innerHTML = '';
        for (const name in playlists) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        }
    });
}

function createPlaylist() {
    const newPlaylistName = document.getElementById('newPlaylistName');
    const name = newPlaylistName.value.trim();
    if (name) {
        playlists[name] = [];
        localStorage.setItem('playlists', JSON.stringify(playlists));
        newPlaylistName.value = '';
        updatePlaylistList();
    }
}

function deletePlaylist(name) {
    if (confirm(`Are you sure you want to delete the playlist "${name}"?`)) {
        delete playlists[name];
        localStorage.setItem('playlists', JSON.stringify(playlists));
        updatePlaylistList();
        document.getElementById('playlistSongs').classList.add('hidden');
    }
}

function addToPlaylist(videoId, title, thumbnail) {
    const playlistSelect = document.querySelector('.playlist-select');
    const addButton = document.querySelector('.add-to-playlist-btn');
    
    addButton.onclick = function() {
        const selectedPlaylist = playlistSelect.value;
        if (selectedPlaylist) {
            playlists[selectedPlaylist].push({ id: videoId, title: title, thumbnail: thumbnail });
            localStorage.setItem('playlists', JSON.stringify(playlists));
            alert(`Added to ${selectedPlaylist}`);
            updatePlaylistList();
        }
    };
}

function playPlaylist(playlistName) {
    const playlist = playlists[playlistName];
    if (playlist && playlist.length > 0) {
        playAudio(playlist[0].id, playlist[0].title, playlist[0].thumbnail, playlist, 0);
    }
}

function showPlaylistSongs(playlistName) {
    const playlistSongsSection = document.getElementById('playlistSongs');
    const playlistSongsList = document.getElementById('playlistSongsList');
    playlistSongsList.innerHTML = '';

    const playlist = playlists[playlistName];
    
    if (playlist && playlist.length > 0) {
        playlist.forEach((song, index) => {
            const songElement = document.createElement('div');
            songElement.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-3';
            songElement.innerHTML = `
                <div class="flex flex-col sm:flex-row items-center justify-between">
                    <span class="truncate mb-2 sm:mb-0 sm:mr-2 flex-grow">${song.title}</span>
                    <div class="flex gap-2">
                        <button class="play-btn bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-600">Play</button>
                        <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
                    </div>
                </div>
            `;

            songElement.querySelector('.play-btn').addEventListener('click', () => {
                playAudio(song.id, song.title, song.thumbnail, playlist, index);
            });

            songElement.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this song from the playlist?')) {
                    playlist.splice(index, 1);
                    localStorage.setItem('playlists', JSON.stringify(playlists));
                    showPlaylistSongs(playlistName);
                    updatePlaylistList();
                }
            });

            playlistSongsList.appendChild(songElement);
        });
    } else {
        playlistSongsList.innerHTML = '<p class="text-gray-600 dark:text-gray-400">No songs in this playlist</p>';
    }

    playlistSongsSection.classList.remove('hidden');
}

// Event Listeners
document.getElementById('createPlaylistBtn').addEventListener('click', createPlaylist);
document.getElementById('playlistLink').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('homeSection').classList.add('hidden');
    document.getElementById('playlistSection').classList.remove('hidden');
    updatePlaylistList();
});

document.getElementById('homeLink').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('playlistSection').classList.add('hidden');
    document.getElementById('homeSection').classList.remove('hidden');
});

// Initialize
updatePlaylistList();

// Export functions to be used in the main script
window.addToPlaylist = addToPlaylist;
window.playPlaylist = playPlaylist;
window.deletePlaylist = deletePlaylist;
window.showPlaylistSongs = showPlaylistSongs;