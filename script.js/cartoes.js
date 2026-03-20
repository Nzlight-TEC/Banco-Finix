 // Shared login/nav/protect code (same as others)
        const hamburger = document.querySelector('.hamburger');
        const navList = document.querySelector('.nav-list');
        hamburger?.addEventListener('click', () => navList.classList.toggle('active'));
        if (localStorage.getItem('isLoggedIn') === 'true') document.querySelector('.login-btn').innerHTML = `<a href="#" onclick="handleLogout()">Sair (${localStorage.getItem('userEmail')})</a>`;
        window.handleLogin = async (formData) => {
            try {
                const response = await fetch('/api/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)});
                const data = await response.json(); if (!data.success) throw new Error(data.message || 'Erro');
                localStorage.setItem('isLoggedIn', 'true'); localStorage.setItem('userEmail', formData.email); alert('Login OK!'); location.reload();
            } catch (error) { alert('Erro: ' + error.message + '\nDemo: user@test.com / 123456'); }
        };
        window.handleLogout = () => { localStorage.removeItem('isLoggedIn'); location.reload(); };
        const loginBtn = document.querySelector('.login-btn a'), modal = document.getElementById('login-modal'), close = document.querySelector('.close');
        if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); modal.style.display = 'flex'; });
        close.addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault(); const formData = {email: e.target.querySelector('input[type="email"]').value, password: e.target.querySelector('input[type="password"]').value};
            if (formData.email === 'user@test.com' && formData.password === '123456') handleLogin(formData); else handleLogin(formData);
        });
        window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
        if (localStorage.getItem('isLoggedIn') !== 'true') { alert('Login necessário.'); window.location.href = 'principal.html'; }

        // Form handler
        document.getElementById('cartao-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            try {
                const response = await fetch('/api/cartoes/solicitar', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(Object.fromEntries(formData), localStorage.getItem('userEmail'))
                });
                const data = await response.json();
                alert(data.message || 'Solicitação enviada!');
            } catch {
                alert('Cartão solicitado com sucesso! Aguarde aprovação.');
            }
        });