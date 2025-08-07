// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Check authentication
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    alert('Please login to watch movies');
    window.location.href = 'auth.html';
}

// Initialize player
const player = videojs('movie-player', {
    controls: true,
    autoplay: true,
    preload: 'auto'
});

// Load movie data
async function loadMovie() {
    if (!movieId) {
        window.location.href = 'index.html';
        return;
    }

    const [movie, videos] = await Promise.all([
        fetchMovieDetails(movieId),
        fetchMovieVideos(movieId)
    ]);

    if (!movie) {
        window.location.href = 'index.html';
        return;
    }

    // Update movie info
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-overview').textContent = movie.overview;
    document.getElementById('movie-rating').textContent = movie.vote_average.toFixed(1);
    document.getElementById('movie-year').textContent = movie.release_date.split('-')[0];

    // Find YouTube trailer
    const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer');
    const videoKey = trailer?.key || videos[0]?.key || 'dQw4w9WgXcQ'; // Fallback to Rick Astley

    // Set video source
    player.src({
        src: `https://www.youtube.com/watch?v=${videoKey}`,
        type: 'video/youtube'
    });

    // Check if movie is in favorites
    const favoriteBtn = document.getElementById('favorite-btn');
    if (currentUser.favorites.includes(movieId.toString())) {
        favoriteBtn.textContent = 'Remove from Favorites';
        favoriteBtn.classList.add('bg-red-600');
    } else {
        favoriteBtn.textContent = 'Add to Favorites';
        favoriteBtn.classList.remove('bg-red-600');
    }
}

// Handle favorite button
document.getElementById('favorite-btn')?.addEventListener('click', () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        const favIndex = users[userIndex].favorites.indexOf(movieId.toString());
        const favoriteBtn = document.getElementById('favorite-btn');
        
        if (favIndex === -1) {
            // Add to favorites
            users[userIndex].favorites.push(movieId.toString());
            favoriteBtn.textContent = 'Remove from Favorites';
            favoriteBtn.classList.add('bg-red-600');
        } else {
            // Remove from favorites
            users[userIndex].favorites.splice(favIndex, 1);
            favoriteBtn.textContent = 'Add to Favorites';
            favoriteBtn.classList.remove('bg-red-600');
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    }
});

// Initialize
loadMovie();