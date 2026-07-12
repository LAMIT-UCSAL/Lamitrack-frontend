import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aviso, Participante } from '../models/participante.model';

@Injectable({ providedIn: 'root' })
export class ComunidadeService {
  constructor(private http: HttpClient) {}

  listarAvisos(): Observable<Aviso[]> {
    return this.http.get<Aviso[]>('assets/data/avisos.json');
  }

  listarParticipantes(): Observable<Participante[]> {
    return this.http.get<Participante[]>('assets/data/participantes.json');
  }
}
