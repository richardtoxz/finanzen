const API_URL = 'https://finanzen-production.up.railway.app';

const createApiError = (errorData, responseStatus, defaultMessage) => {
    const customError = new Error(defaultMessage || 'Ocorreu um erro na solicitação à API.');
    customError.response = {
        data: errorData,
        status: responseStatus
    };
    return customError;
};

const sanitizeInput = (input) => {
    return typeof input === 'string' ? input.trim() : input;
};

export const api = {
    async register(userData) {
        const sanitizedData = {
            nomeUsuario: sanitizeInput(userData.name),
            email: sanitizeInput(userData.email),
            senha: sanitizeInput(userData.password),
            objetivoPreferencias: sanitizeInput(userData.goals),
            rendaMensalPreferencias: sanitizeInput(userData.income)
        };

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw createApiError(errorData, response.status, 'Erro ao registrar usuário.');
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
                email: sanitizeInput(email),
                codigo_Verificacao: sanitizeInput(verificationCode)
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw createApiError(errorData, response.status, 'Erro ao verificar e-mail.');
        }

        return response.json();
    },

    async login(credentials) {
        const loginData = {
            email: sanitizeInput(credentials.email),
            senha: sanitizeInput(credentials.senha || credentials.password)
        };
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw createApiError(errorData, response.status, 'Falha na tentativa de login.');
        }

        return response.json();
    }
};

