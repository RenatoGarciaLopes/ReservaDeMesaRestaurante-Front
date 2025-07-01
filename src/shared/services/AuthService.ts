
import axios from 'axios'; // Certifique-se de ter o axios instalado: npm install axios

const API_URL = 'http://localhost:8080/api/auth'; // Ajuste para a URL do seu backend

const AuthService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      // Supondo que a resposta contenha o objeto do funcionário e um token
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Você pode adicionar outras funções como register, refresh token, etc.
};

export default AuthService;