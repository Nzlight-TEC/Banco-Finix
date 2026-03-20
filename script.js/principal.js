  // Mobile nav toggle
        const hamburger = document.querySelector('.hamburger');
        const navList = document.querySelector('.nav-list');
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        // Modal
        const loginBtn = document.querySelector('.login-btn a');
        const modal = document.getElementById('login-modal');
        const close = document.querySelector('.close');
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
        close.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        // Contact form handler
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Obrigado pelo contato.');
        });

// Global functions (backend-ready)
        window.handleLogin = async (formData) => {
            try {
                // Mock API call - replace with real backend
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (!data.success) throw new Error(data.message || 'Erro no login');
                
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', formData.email);
                document.querySelector('.login-btn').innerHTML = `<a href="servicos.html">Dashboard</a>`;
                alert('Login realizado! Redirecionando...');
                window.location.href = 'servicos.html';
            } catch (error) {
                alert('Erro: ' + error.message + '\\nDemo: user@test.com / 123456');
            }
        };

        window.handleLogout = () => {
            localStorage.removeItem('isLoggedIn');
            location.reload();
        };

        // Check login state on load
        if (localStorage.getItem('isLoggedIn') === 'true') {
            document.querySelector('.login-btn').innerHTML = '<a href="#" onclick="localStorage.removeItem(\'isLoggedIn\');location.reload();">Sair</a>';
        }

        // Login form handler - SIMPLIFIED WORKING VERSION
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            const password = e.target.querySelector('input[type="password"]').value;
            
            if (email === 'user@test.com' && password === '123456') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                document.querySelector('.login-btn').innerHTML = '<a href="servicos.html" class="dashboard-nav">Dashboard</a>';
                alert('Login OK! Redirecionando para serviços...');
                window.location.href = 'servicos.html';
            } else {
                alert('Credenciais inválidas!\\nUse: user@test.com / 123456');
            }
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    
