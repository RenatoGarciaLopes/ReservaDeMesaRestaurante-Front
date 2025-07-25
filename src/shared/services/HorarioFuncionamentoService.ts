import axios from 'axios';

const API_URL = 'http://localhost:8080/api/horarios-funcionamento';

export interface ListarHorarioFuncionamento {
  diaFuncionamento: string;
  horarioInicio: string;
  horarioFim: string;
}

export async function listarHorariosFuncionamento(): Promise<ListarHorarioFuncionamento[]> {
  try {
    const response = await axios.get(API_URL);
    return response.data.data as ListarHorarioFuncionamento[];
  } catch (error) {
    throw new Error('Erro ao buscar horários de funcionamento.');
  }
}
