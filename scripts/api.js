const API_KEY = '747346fe6a2fe0338047bac48babc201'; // Get from https://www.themoviedb.org/settings/api
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Fetch trending movies
async function fetchTrendingMovies() {
    try {
        const response = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}

// Fetch movie details
async function fetchMovieDetails(movieId) {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

// Render movies on homepage
async function renderTrendingMovies() {
    const movies = await fetchTrendingMovies();
    const container = document.getElementById('trending-movies');
    
    if (movies.length === 0) {
        container.innerHTML = '<p class="text-gray-400">No movies found</p>';
        return;
    }

    container.innerHTML = movies.map(movie => `
        <div class="movie-card h-64">
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <div class="movie-card-overlay">
                <div>
                    <h3 class="font-bold">${movie.title}</h3>
                    <p class="text-sm">${movie.release_date.split('-')[0]}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize on page load
if (document.getElementById('trending-movies')) {
    renderTrendingMovies();
}