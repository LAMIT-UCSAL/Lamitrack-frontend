import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Evento } from '../models/evento.model';

const CHAVE_EVENTOS_CRIADOS = 'eve_eventos_criados';
const CHAVE_EVENTOS_REMOVIDOS = 'eve_eventos_removidos';

@Injectable({ providedIn: 'root' })
export class EventosService {
  private readonly url = 'assets/data/eventos.json';

  constructor(private http: HttpClient) {}

  /**
   * Lista os eventos mockados de eventos.json mesclados com o estado local
   * (eventos criados e removidos via o painel do organizador, persistidos no
   * localStorage — não há backend real, então essa é a única forma de dar
   * a sensação de "salvar"/"apagar" de fato entre as telas).
   */
  listar(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.url).pipe(
      map(base => this.mesclarComEstadoLocal(base))
    );
  }

  buscarPorId(id: number): Observable<Evento[]> {
    return this.listar();
  }

  criar(evento: Evento): void {
    const criados = this.lerCriados();
    criados.push(evento);
    localStorage.setItem(CHAVE_EVENTOS_CRIADOS, JSON.stringify(criados));
  }

  remover(id: number): void {
    const removidos = this.lerRemovidos();
    if (!removidos.includes(id)) {
      localStorage.setItem(CHAVE_EVENTOS_REMOVIDOS, JSON.stringify([...removidos, id]));
    }

    const criados = this.lerCriados().filter(e => e.id !== id);
    localStorage.setItem(CHAVE_EVENTOS_CRIADOS, JSON.stringify(criados));
  }

  private mesclarComEstadoLocal(base: Evento[]): Evento[] {
    const removidos = this.lerRemovidos();
    const criados = this.lerCriados();
    return [...criados, ...base].filter(evento => !removidos.includes(evento.id));
  }

  private lerCriados(): Evento[] {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_EVENTOS_CRIADOS) ?? '[]');
    } catch {
      return [];
    }
  }

  private lerRemovidos(): number[] {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_EVENTOS_REMOVIDOS) ?? '[]');
    } catch {
      return [];
    }
  }

  calcularOcupacao(evento: Evento): number {
    return Math.round((evento.inscritos / evento.capacidadeTotal) * 100);
  }

  calcularReceitaProjetada(evento: Evento): number {
    return evento.inscritos * evento.precoIngresso;
  }

  calcularComissaoPlataforma(evento: Evento): number {
    return this.calcularReceitaProjetada(evento) * 0.05;
  }

  calcularReceitaLiquida(evento: Evento): number {
    return this.calcularReceitaProjetada(evento) - this.calcularComissaoPlataforma(evento);
  }
}
