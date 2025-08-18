// Get current user
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

alert("Hello from here man")

if (!currentUser) {
    window.location.href = 'auth.html';
}

// Logout
document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Render watchlist
async function renderWatchlist() {
    const container = document.getElementById('watchlist');
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    
    if (!currentUser?.watchlist?.length) {
        container.innerHTML = '<p class="text-gray-400">Your watchlist is empty</p>';
        return;
    }
    
    // Fetch details for each movie in watchlist
    const movieDetails = await Promise.all(
        currentUser.watchlist.map(id => fetchMovieDetails(id))
    );
    
    container.innerHTML = movieDetails.filter(Boolean).map(movie => `
        <div class="movie-card h-64">
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <div class="movie-card-overlay">
                <div>
                    <h3 class="font-bold">${movie.title}</h3>
                    <button 
                        onclick="window.location.href='watch.html?id=${movie.id}'"
                        class="mt-2 text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md">
                        Watch Now
                    </button>
                    <button 
                        data-movie-id="${movie.id}"
                        class="remove-watchlist mt-2 text-sm bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-md">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-watchlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const movieId = e.target.getAttribute('data-movie-id');
            removeFromWatchlist(movieId);
        });
    });
}

function removeFromWatchlist(movieId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        const watchlistIndex = users[userIndex].watchlist.indexOf(movieId);
        if (watchlistIndex !== -1) {
            users[userIndex].watchlist.splice(watchlistIndex, 1);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            renderWatchlist();
        }
    }
}

// Initialize
renderWatchlist();