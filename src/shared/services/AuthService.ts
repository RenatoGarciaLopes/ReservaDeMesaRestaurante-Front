
import axios from 'axios'; // Certifique-se de ter o axios instalado: npm install axios

const API_URL = 'http://localhost:8080/api/auth/funcionario'; // Ajuste para a URL do seu backend

const AuthService = {
  login: async (email: string, senha: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, senha });
      // Retorna o token JWT recebido do backend
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Você pode adicionar outras funções como register, refresh token, etc.
};

export default AuthService;