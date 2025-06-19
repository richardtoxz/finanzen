// const API_URL = 'https://finanzen-production.up.railway.app';   descomente para produção
const API_URL = 'http://localhost:8000';

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

const clearAuthData = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_data');
};

const authenticatedFetch = async (url, options = {}) => {
    const userId = localStorage.getItem('user_id');
    const userData = localStorage.getItem('user_data');

    if (!userId || !userData) {
        console.error('❌ Dados de autenticação ausentes:', { userId: !!userId, userData: !!userData });

        clearAuthData();

        throw createApiError(
            { detail: 'Usuário não autenticado' },
            401,
            'Você precisa estar logado para realizar esta ação. Faça login novamente.'
        );
    }

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    }; const response = await fetch(url, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
        console.error('Erro na resposta (authenticatedFetch):', {
            url,
            status: response.status,
            errorData,
            userId
        });
        throw createApiError(errorData, response.status, 'Erro na solicitação autenticada.');
    }

    const contentType = response.headers.get('content-type');
    if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
        return {};
    }

    return response.json();
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
            console.error('Erro na resposta (register):', errorData);
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
            console.error('Erro na resposta (verifyEmail):', errorData);
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
        }); if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro na resposta (login):', errorData);
            throw createApiError(errorData, response.status, 'Falha na tentativa de login.');
        } const loginResponse = await response.json();

        if (loginResponse.user && loginResponse.user.idUsuario) {
            const userId = loginResponse.user.idUsuario.toString();
            console.log('✅ Login realizado com sucesso para user_id:', userId);
            localStorage.setItem('user_id', userId);
        }

        return loginResponse;
    }, logout() {
        clearAuthData();

    },

    async getCategorias() {
        return authenticatedFetch(`${API_URL}/categorias`);
    }, async createCategoria(data) {
        return authenticatedFetch(`${API_URL}/categorias`, {
            method: 'POST',
            body: JSON.stringify({
                nome: sanitizeInput(data.name),
                tipo: sanitizeInput(data.type || 'despesa').toLowerCase()
            })
        });
    }, async updateCategoria(id, data) {
        return authenticatedFetch(`${API_URL}/categorias/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                nome: sanitizeInput(data.name),
                tipo: sanitizeInput(data.type || 'despesa').toLowerCase()
            })
        });
    },

    async deleteCategoria(id) {
        return authenticatedFetch(`${API_URL}/categorias/${id}`, {
            method: 'DELETE'
        });
    },

    async getTransacoes(filtros = {}) {
        const params = new URLSearchParams();

        if (filtros.categoria) params.append('categoria', filtros.categoria);
        if (filtros.tipo) params.append('tipo', filtros.tipo);
        if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
        if (filtros.dataFim) params.append('dataFim', filtros.dataFim);

        const queryString = params.toString();
        const url = queryString ? `${API_URL}/transacoes?${queryString}` : `${API_URL}/transacoes`;

        return authenticatedFetch(url);
    }, async createTransacao(data) {
        return authenticatedFetch(`${API_URL}/transacoes`, {
            method: 'POST',
            body: JSON.stringify({
                tipo: sanitizeInput(data.type).toLowerCase(),
                valor: parseFloat(data.valor.replace(/[R$\s.]/g, '').replace(',', '.')),
                descricao: sanitizeInput(data.description || ''),
                data_movimentacao: sanitizeInput(data.date),
                categoria_id: parseInt(data.categoryId)
            })
        });
    }, async updateTransacao(id, data) {
        return authenticatedFetch(`${API_URL}/transacoes/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                tipo: sanitizeInput(data.type).toLowerCase(),
                valor: parseFloat(data.valor.replace(/[R$\s.]/g, '').replace(',', '.')),
                descricao: sanitizeInput(data.description || ''),
                data_movimentacao: sanitizeInput(data.date),
                categoria_id: parseInt(data.categoryId)
            })
        });
    },

    async deleteTransacao(id) {
        return authenticatedFetch(`${API_URL}/transacoes/${id}`, {
            method: 'DELETE'
        });
    },

    async getMetas() {
        return authenticatedFetch(`${API_URL}/metas`);
    }, async createMeta(data) {
        return authenticatedFetch(`${API_URL}/metas`, {
            method: 'POST',
            body: JSON.stringify({
                nome: sanitizeInput(data.nome),
                valor_objetivo: data.valor_objetivo,
                descricao: sanitizeInput(data.descricao || ''),
                data_limite: data.data_limite || null
            })
        });
    },

    async updateMeta(id, data) {
        return authenticatedFetch(`${API_URL}/metas/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                nome: sanitizeInput(data.nome),
                valor_objetivo: data.valor_objetivo,
                descricao: sanitizeInput(data.descricao || ''),
                data_limite: data.data_limite || null
            })
        });
    },

    async deleteMeta(id) {
        return authenticatedFetch(`${API_URL}/metas/${id}`, {
            method: 'DELETE'
        });
    },

    async getOrcamentos(filtros = {}) {
        const params = new URLSearchParams();
        
        if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
        if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
        if (filtros.categoria_id) params.append('categoria_id', filtros.categoria_id);

        const queryString = params.toString();
        const url = queryString ? `${API_URL}/orcamentos?${queryString}` : `${API_URL}/orcamentos`;

        return authenticatedFetch(url);
    },

    async createOrcamento(data) {
        return authenticatedFetch(`${API_URL}/orcamentos`, {
            method: 'POST',
            body: JSON.stringify({
                nome: sanitizeInput(data.nome),
                valor_orcado: parseFloat(data.valor_orcado.toString().replace(/[R$\s.]/g, '').replace(',', '.')),
                data_inicio: sanitizeInput(data.data_inicio),
                data_fim: sanitizeInput(data.data_fim),
                categoria_id: data.categoria_id ? parseInt(data.categoria_id) : null
            })
        });
    },

    async updateOrcamento(id, data) {
        return authenticatedFetch(`${API_URL}/orcamentos/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                nome: sanitizeInput(data.nome),
                valor_orcado: data.valor_orcado ? parseFloat(data.valor_orcado.toString().replace(/[R$\s.]/g, '').replace(',', '.')) : undefined,
                data_inicio: data.data_inicio ? sanitizeInput(data.data_inicio) : undefined,
                data_fim: data.data_fim ? sanitizeInput(data.data_fim) : undefined,
                categoria_id: data.categoria_id ? parseInt(data.categoria_id) : null
            })
        });
    },

    async deleteOrcamento(id) {
        return authenticatedFetch(`${API_URL}/orcamentos/${id}`, {
            method: 'DELETE'
        });
    }
};

