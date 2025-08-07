const API_KEY = '747346fe6a2fe0338047bac48babc201';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Axios instance with auth header
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NDczNDZmZTZhMmZlMDMzODA0N2JhYzQ4YmFiYzIwMSIsInN1YiI6IjY2MjYyMWQ5NjJmMzM1MDE0YjA0YmQ3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7QHRqJZ1Q8QZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ`
    }
});

// Fetch trending movies
async function fetchTrendingMovies() {
    try {
        const response = await api.get(`/trending/movie/week?api_key=${API_KEY}`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}

// Fetch popular movies
async function fetchPopularMovies() {
    try {
        const response = await api.get(`/movie/popular?api_key=${API_KEY}`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
}

// Search movies
async function searchMovies(query) {
    try {
        const response = await api.get(`/search/movie?api_key=${API_KEY}&query=${query}`);
        return response.data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}

// Fetch movie details
async function fetchMovieDetails(movieId) {
    try {
        const response = await api.get(`/movie/${movieId}?api_key=${API_KEY}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

// Fetch movie videos (trailers)
async function fetchMovieVideos(movieId) {
    try {
        const response = await api.get(`/movie/${movieId}/videos?api_key=${API_KEY}`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movie videos:', error);
        return [];
    }
}

// Render movie cards
function renderMovieCards(movies, containerId) {
    const container = document.getElementById(containerId);
    
    if (!movies.length) {
        container.innerHTML = '<p class="text-gray-400">No movies found</p>';
        return;
    }

    container.innerHTML = movies.map(movie => `
        <div class="movie-card h-64 relative group">
            <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : './assets/images/no-poster.jpg'}" 
                 alt="${movie.title}" 
                 class="w-full h-full object-cover rounded-lg">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 class="font-bold text-white">${movie.title}</h3>
                <p class="text-sm text-gray-300">${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                <div class="flex space-x-2 mt-2">
                    <button onclick="window.location.href='watch.html?id=${movie.id}'" 
                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">
                        Watch
                    </button>
                    <button data-movie-id="${movie.id}" 
                            class="favorite-btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm">
                        ♥
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const movieId = e.target.getAttribute('data-movie-id');
            toggleFavorite(movieId, e.target);
        });
    });
}

// Toggle favorite status
function toggleFavorite(movieId, button) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to add favorites');
        window.location.href = 'auth.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        const favIndex = users[userIndex].favorites.indexOf(movieId);
        if (favIndex === -1) {
            // Add to favorites
            users[userIndex].favorites.push(movieId);
            button.classList.add('bg-red-600', 'hover:bg-red-700');
            button.classList.remove('bg-gray-700', 'hover:bg-gray-600');
        } else {
            // Remove from favorites
            users[userIndex].favorites.splice(favIndex, 1);
            button.classList.remove('bg-red-600', 'hover:bg-red-700');
            button.classList.add('bg-gray-700', 'hover:bg-gray-600');
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    }
}

// Initialize homepage
if (document.getElementById('trending-movies')) {
    Promise.all([fetchTrendingMovies(), fetchPopularMovies()])
        .then(([trending, popular]) => {
            renderMovieCards(trending, 'trending-movies');
            renderMovieCards(popular, 'popular-movies');
        });
}