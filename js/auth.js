// Funções de autenticação
const API_URL = 'https://superpro2025.onrender.com/api'; // URL do backend hospedado

// Função para fazer login
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao fazer login');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, data };
        } else {
            throw new Error('Token não recebido do servidor');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        return { success: false, error: error.message || 'Erro ao fazer login. Tente novamente.' };
    }
}

// Função para verificar se o usuário está autenticado
function isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    return true;
}

// Função para obter o token
function getToken() {
    return localStorage.getItem('token');
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index2.html';
}

// Função para verificar autenticação em páginas protegidas
function checkAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'index2.html';
        return false;
    }
    return true;
}

// Função para adicionar o token em requisições
function getAuthHeaders() {
    const token = getToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Verifica autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Se estiver na página de login (index2.html), não verifica autenticação
    if (window.location.pathname.includes('index2.html')) {
        return;
    }
    
    // Se estiver em qualquer outra página, verifica autenticação
    if (!isAuthenticated()) {
        window.location.href = 'index2.html';
    }
}); 