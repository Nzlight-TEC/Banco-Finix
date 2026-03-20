 // Shared login/nav (no redirect protection)
        const hamburger = document.querySelector('.hamburger'), navList = document.querySelector('.nav-list');
        hamburger?.addEventListener('click', () => navList.classList.toggle('active'));
        if (localStorage.getItem('isLoggedIn') === 'true') document.querySelector('.login-btn').innerHTML = `<a href="#" onclick="handleLogout()">Sair</a>`;
        window.handleLogin = async (formData) => {/* same */}; window.handleLogout = () => { localStorage.removeItem('isLoggedIn'); location.reload(); };
        // Modal handlers same as others...
        const loginBtn = document.querySelector('.login-btn a'), modal = document.getElementById('login-modal'), close = document.querySelector('.close');
        if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); modal.style.display = 'flex'; });
        close?.addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('login-form')?.addEventListener('submit', (e) => {/* same login */});
        window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });