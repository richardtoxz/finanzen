const API_URL = 'https://finanzen.pythonanywhere.com';

export const api = {
    async register(userData) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nomeUsuario: userData.name,
                email: userData.email,
                senha: userData.password,
                objetivoPreferencias: userData.goals,
                rendaMensalPreferencias: userData.income
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Erro ao registrar usuário');
        }

        return response.json();
    },

    async verifyEmail(email, verificationCode) {
        const response = await fetch(`${API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                codigo_Verificacao: verificationCode
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Erro ao verificar email');
        }

        return response.json();
    },

    async login(credentials) {
        const loginData = {
            email: credentials.email,
            senha: credentials.senha || credentials.password
        };

        console.log('Enviando requisição de login:', loginData);
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Erro na resposta:', error);
            throw new Error(error.detail?.join(', ') || error.detail || 'Erro ao fazer login');
        }

        const data = await response.json();
        console.log('Resposta do login:', data);
        return data;
    }
};
