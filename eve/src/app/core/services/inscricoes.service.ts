import { Injectable } from '@angular/core';
import { Inscricao } from '../models/inscricao.model';

@Injectable({ providedIn: 'root' })
export class InscricoesService {
  private inscricoes: Inscricao[] = [];

  criar(dados: Omit<Inscricao, 'id' | 'dataInscricao' | 'checkinRealizado'>): Inscricao {
    const nova: Inscricao = {
      ...dados,
      id: this.inscricoes.length + 1,
      dataInscricao: new Date().toISOString(),
      checkinRealizado: false
    };
    this.inscricoes.push(nova);
    return nova;
  }

  listarPorEvento(eventoId: number): Inscricao[] {
    return this.inscricoes.filter(i => i.eventoId === eventoId);
  }

  alternarCheckin(id: number): void {
    const inscricao = this.inscricoes.find(i => i.id === id);
    if (inscricao) {
      inscricao.checkinRealizado = !inscricao.checkinRealizado;
    }
  }
}
