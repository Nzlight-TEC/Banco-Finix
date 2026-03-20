  // Shared login/nav/protection JS (identical to conta-corrente.html)
        const hamburger = document.querySelector('.hamburger');
        const navList = document.querySelector('.nav-list');
        hamburger?.addEventListener('click', () => navList.classList.toggle('active'));
        if (localStorage.getItem('isLoggedIn') === 'true') {
            document.querySelector('.login-btn').innerHTML = `<a href="#" onclick="handleLogout()">Sair (${localStorage.getItem('userEmail')})</a>`;
        }
        window.handleLogin = async (formData) => {
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
        if (localStorage.getItem('isLoggedIn') !== 'true') { alert('Faça login para acessar.'); window.location.href = 'principal.html'; }

        // Form handler (backend-ready simulator)
        document.getElementById('poupanca-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const valor = parseFloat(document.getElementById('valor-poupanca').value);
            const taxa = parseFloat(document.getElementById('taxa').value) / 100;
            const meses = parseInt(document.getElementById('meses').value);
            try {
                const response = await fetch('/api/poupanca/calculate', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({valor, taxa, meses, userEmail: localStorage.getItem('userEmail')})
                });
                const data = await response.json();
                alert(`Rendimento: R$ ${data.rendimento.toFixed(2)} | Total: R$ ${data.total.toFixed(2)}`);
            } catch (error) {
                const rendimento = valor * Math.pow(1 + taxa, meses) - valor;
                alert(`Rendimento estimado: R$ ${rendimento.toFixed(2)} | Total: R$ ${(valor + rendimento).toFixed(2)}`);
            }
        });