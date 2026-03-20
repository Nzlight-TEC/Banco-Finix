 // Shared login/nav logic from principal.html
        const hamburger = document.querySelector('.hamburger');
        const navList = document.querySelector('.nav-list');
        hamburger?.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        // Check login state
        if (localStorage.getItem('isLoggedIn') === 'true') {
            document.querySelector('.login-btn').innerHTML = `<a href="#" onclick="handleLogout()">Sair (${localStorage.getItem('userEmail')})</a>`;
        }

        // Global functions (copied from principal)
        window.handleLogin = async (formData) => {
            // Same as principal.html
            try {
                const response = await fetch('/api/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)});
                const data = await response.json();
                if (!data.success) throw new Error(data.message || 'Erro no login');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', formData.email);
                alert('Login realizado!');
                location.reload();
            } catch (error) {
                alert('Erro: ' + error.message + '\nDemo: user@test.com / 123456');
            }
        };
        window.handleLogout = () => { localStorage.removeItem('isLoggedIn'); location.reload(); };

        const loginBtn = document.querySelector('.login-btn a');
        const modal = document.getElementById('login-modal');
        const close = document.querySelector('.close');
        if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); modal.style.display = 'flex'; });
        close.addEventListener('click', () => { modal.style.display = 'none'; });
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {email: e.target.querySelector('input[type="email"]').value, password: e.target.querySelector('input[type="password"]').value};
            if (formData.email === 'user@test.com' && formData.password === '123456') handleLogin(formData); else handleLogin(formData);
        });
        window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

        // Protect page - redirect if not logged in
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            alert('Faça login para acessar esta página.');
            window.location.href = 'principal.html';
        }

        // Form handler (backend-ready)
        document.getElementById('corrente-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const saldo = parseFloat(document.getElementById('saldo').value) || 0;
            const valor = parseFloat(document.getElementById('valor').value);
            const operacao = document.getElementById('operacao').value;
            try {
                const response = await fetch('/api/conta-corrente', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({saldo, valor, operacao, userEmail: localStorage.getItem('userEmail')})
                });
                const data = await response.json();
                alert(data.message || 'Operação realizada!');
            } catch (error) {
                alert(`Novo saldo: R$ ${operacao === 'saque' ? saldo - valor : saldo + valor}`);
            }
        });