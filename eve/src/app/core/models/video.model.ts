import { CategoriaEvento } from './evento.model';

export interface ComentarioVideo {
  id: number;
  autor: string;
  iniciais: string;
  mensagem: string;
  tempo: string;
}

export interface Video {
  id: number;
  eventoId: number;
  categoria: CategoriaEvento;
  titulo: string;
  organizador: string;
  videoUrl: string;
  thumbnailUrl: string;
  visualizacoes: number;
  curtidas: number;
  curtido?: boolean;
  comentarios: ComentarioVideo[];
}
