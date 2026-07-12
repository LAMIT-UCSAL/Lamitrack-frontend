export interface Inscricao {
  id: number;
  eventoId: number;
  nome: string;
  email: string;
  cpf?: string;
  aceiteLgpd: boolean;
  dataInscricao: string;
  checkinRealizado: boolean;
}
