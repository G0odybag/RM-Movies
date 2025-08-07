// Get search query from URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');

// DOM elements
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const loadingSpinner = document.getElementById('loading-spinner');
const noResults = document.getElementById('no-results');
const searchResultsTitle = document.getElementById('search-results-title');

// Initialize search
if (query) {
    searchInput.value = query;
    performSearch(query);
}

// Search button event
document.getElementById('search-btn').addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
    }
});

// Enter key event
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
        }
    }
});

// Perform search
async function performSearch(query) {
    try {
        // Show loading state
        searchResults.innerHTML = '';
        loadingSpinner.classList.remove('hidden');
        noResults.classList.add('hidden');
        searchResultsTitle.textContent = `Search Results for "${query}"`;
        
        // Fetch results
        const results = await searchMovies(query);
        
        // Hide loading spinner
        loadingSpinner.classList.add('hidden');
        
        if (results.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }
        
        // Render results
        renderMovieCards(results, 'search-results');
        
    } catch (error) {
        console.error('Search error:', error);
        loadingSpinner.classList.add('hidden');
        noResults.classList.remove('hidden');
    }
}

// Render movie cards (similar to api.js but with some adjustments)
function renderMovieCards(movies, containerId) {
    const container = document.getElementById(containerId);
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { favorites: [] };
    
    container.innerHTML = movies.map(movie => `
        <div class="movie-card h-64 relative group">
            <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : '../assets/images/no-poster.jpg'}" 
                 alt="${movie.title}" 
                 class="w-full h-full object-cover rounded-lg">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 class="font-bold text-white">${movie.title}</h3>
                <p class="text-sm text-gray-300">${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                <div class="flex space-x-2 mt-2">
                    <button onclick="handleWatchClick(${movie.id}, event)" 
                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">
                        ${currentUser ? 'Watch' : 'Login to Watch'}
                    </button>
                    <button data-movie-id="${movie.id}" 
                            class="favorite-btn ${currentUser?.favorites?.includes(movie.id.toString()) ? 'bg-red-600' : 'bg-gray-700'} hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm">
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

// Handle watch button click
function handleWatchClick(movieId, event) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        event.preventDefault();
        alert('Please login to watch movies');
        window.location.href = 'auth.html';
    } else {
        window.location.href = `watch.html?id=${movieId}`;
    }
}

// Initialize
if (document.getElementById('search-results')) {
    // Check if we have a search query
    if (!query) {
        searchResultsTitle.textContent = 'Please enter a search term';
        noResults.classList.remove('hidden');
    }
}