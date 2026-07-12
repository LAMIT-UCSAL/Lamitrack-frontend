export type TipoUsuario = 'participante' | 'organizador';

export interface UsuarioLogado {
  nome: string;
  email: string;
  tipo: TipoUsuario;
}

export interface ContaCadastrada extends UsuarioLogado {
  senha: string;
}
