export type CategoriaEvento = 'Hackathon' | 'Ideathon' | 'Maratona' | 'Edital';

export interface Evento {
  id: number;
  titulo: string;
  categoria: CategoriaEvento;
  descricao: string;
  data: string;
  dataFormatada: string;
  local: string;
  capacidadeTotal: number;
  inscritos: number;
  precoIngresso: number;
  organizador: string;
  imagemUrl: string;
}
