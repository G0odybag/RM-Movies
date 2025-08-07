// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user && window.location.pathname.includes('auth.html')) {
        window.location.href = 'dashboard.html';
    } else if (!user && !window.location.pathname.includes('auth.html')) {
        window.location.href = 'auth.html';
    }
}

// Toggle between login and signup forms
document.getElementById('switch-to-signup')?.addEventListener('click', () => {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
});

document.getElementById('switch-to-login')?.addEventListener('click', () => {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
});

// Handle login
document.querySelector('#login-form form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials!');
    }
});

// Handle signup
document.querySelector('#signup-form form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const confirmPassword = e.target[2].value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.email === email)) {
        alert('User already exists!');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        email,
        password,
        watchlist: []
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    window.location.href = 'dashboard.html';
});

// Check auth on page load
checkAuth();