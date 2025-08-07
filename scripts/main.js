// Dark theme toggle
document.getElementById('theme-toggle')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
});

// Check saved preference
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Redirect to auth page
document.getElementById('auth-btn')?.addEventListener('click', () => {
    window.location.href = 'auth.html';
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}