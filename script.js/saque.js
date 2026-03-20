 // Nav mobile
        document.querySelector('.hamburger')?.addEventListener('click', () => {
            document.querySelector('.nav-list').classList.toggle('active');
        });

        // Login modal
        const loginBtn = document.querySelector('.login-btn a');
        const modal = document.getElementById('login-modal');
        const close = document.querySelector('.close');
        loginBtn?.addEventListener('click', e => { e.preventDefault(); modal.style.display = 'flex'; });
        close.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

        document.getElementById('login-form').addEventListener('submit', e => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            if (email === 'user@test.com' && password === '123456') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                location.reload();
            } else {
                alert('Demo: user@test.com / 123456');
            }
        });

        // Proteção login
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            alert('Login necessário');
            window.location.href = 'principal.html';
        } else {
            document.querySelector('.login-btn').innerHTML = `Sair (${localStorage.getItem('userEmail')})`;
            document.querySelector('.login-btn').onclick = () => localStorage.removeItem('isLoggedIn') || location.reload();
            // Saldo mock
            if (!localStorage.saldoMock) localStorage.saldoMock = 10000;
            document.getElementById('saldo-atual').value = parseFloat(localStorage.saldoMock).toFixed(2);
        }

        // Saque
        document.getElementById('saque-form').addEventListener('submit', async e => {
            e.preventDefault();
            const saldo = parseFloat(document.getElementById('saldo-atual').value);
            const valor = parseFloat(document.getElementById('valor-saque').value);
            const pin = document.getElementById('pin').value;

            if (valor > saldo || valor <= 0) return document.getElementById('resultado').innerHTML = '<span style="color:red">Saldo insuficiente!</span>';
            if (pin !== '1234') return document.getElementById('resultado').innerHTML = '<span style="color:red">PIN incorreto (demo:1234)</span>';

            const resultado = document.getElementById('resultado');
            resultado.textContent = 'Processando...';

            try {
                // Seu BD aqui
                const res = await fetch('/api/saque', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({saldo, valor, pin, userEmail: localStorage.userEmail})
                });
                const data = await res.json();
                if (data.success) {
                    const novoSaldo = saldo - valor;
                    localStorage.saldoMock = novoSaldo;
                    resultado.innerHTML = `<span style="color:green">Saque OK! Novo saldo: R$ ${novoSaldo.toFixed(2)}</span>`;
                } else throw data.error;
            } catch {
                // Demo
                const novoSaldo = saldo - valor;
                localStorage.saldoMock = novoSaldo;
                resultado.innerHTML = `<span style="color:green">Demo OK! R$ ${valor.toFixed(2)} sacado. Saldo: R$ ${novoSaldo.toFixed(2)}</span>`;
            }

            // Refresh saldo
            document.getElementById('saldo-atual').value = localStorage.saldoMock;
            document.getElementById('valor-saque').value = '';
            document.getElementById('pin').value = '';
        });