export interface Participante {
  id: number;
  eventoId: number;
  nome: string;
  area: string;
  interesse: string;
  iniciais: string;
  cor: string;
}

export interface Aviso {
  id: number;
  eventoId: number;
  autor: string;
  iniciais: string;
  mensagem: string;
  tempo: string;
}
