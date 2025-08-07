// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Back button
document.getElementById('back-btn').addEventListener('click', () => {
    window.history.back();
});

// Initialize player
const player = videojs('movie-player');

// Fetch movie details and set up player
async function loadMovie() {
    if (!movieId) {
        window.location.href = 'index.html';
        return;
    }

    const movie = await fetchMovieDetails(movieId);
    if (!movie) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-overview').textContent = movie.overview;

    // For demo purposes - in a real app you'd use actual video streams
    // Here we'll use a sample trailer from YouTube
    const trailerUrl = `https://www.youtube.com/watch?v=${movie.videos?.results[0]?.key || 'dQw4w9WgXcQ'}`;
    
    // Using video.js YouTube plugin (you'd need to include it)
    player.src({
        type: 'video/youtube',
        src: trailerUrl
    });

    // Watchlist button
    const watchlistBtn = document.getElementById('add-to-watchlist');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (currentUser?.watchlist?.includes(movieId)) {
        watchlistBtn.textContent = 'Remove from Watchlist';
        watchlistBtn.classList.add('bg-gray-600');
        watchlistBtn.classList.remove('bg-red-600');
    }
    
    watchlistBtn.addEventListener('click', () => {
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            const watchlistIndex = users[userIndex].watchlist.indexOf(movieId);
            
            if (watchlistIndex === -1) {
                // Add to watchlist
                users[userIndex].watchlist.push(movieId);
                watchlistBtn.textContent = 'Remove from Watchlist';
                watchlistBtn.classList.add('bg-gray-600');
                watchlistBtn.classList.remove('bg-red-600');
            } else {
                // Remove from watchlist
                users[userIndex].watchlist.splice(watchlistIndex, 1);
                watchlistBtn.textContent = 'Add to Watchlist';
                watchlistBtn.classList.remove('bg-gray-600');
                watchlistBtn.classList.add('bg-red-600');
            }
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
    });
}

// Initialize
loadMovie();