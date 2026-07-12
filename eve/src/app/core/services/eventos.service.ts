import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventosService {
  private readonly url = 'assets/data/eventos.json';

  constructor(private http: HttpClient) {}

  listar(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.url);
  }

  buscarPorId(id: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.url);
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
