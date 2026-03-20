 // Mobile nav toggle (same)
        const hamburger = document.querySelector('.hamburger');
        const navList = document.querySelector('.nav-list');
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        // Modal (same)
        const loginBtn = document.querySelector('.login-btn a');
        const modal = document.getElementById('login-modal');
        const close = document.querySelector('.close');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'flex';
            });
        }
        close.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        // Backend-ready account form
        window.handleAccountSubmit = async (formData) => {
            try {
                const response = await fetch('/api/abrir-conta', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (data.success) {
                    alert('Conta solicitada! Aguarde aprovação.');
                } else {
                    alert(data.message || 'Erro na solicitação.');
                }
            } catch (error) {
                alert('Solicitação enviada! Em breve entraremos em contato via email.');
            }
        };

        document.getElementById('account-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                cpf: document.getElementById('cpf').value,
                telefone: document.getElementById('telefone').value,
                tipoConta: document.getElementById('tipo-conta').value
            };
            handleAccountSubmit(formData);
        });