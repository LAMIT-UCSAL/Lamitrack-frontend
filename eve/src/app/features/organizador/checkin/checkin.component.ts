import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Evento } from '../../../core/models/evento.model';
import { Participante } from '../../../core/models/participante.model';
import { EventosService } from '../../../core/services/eventos.service';
import { ComunidadeService } from '../../../core/services/comunidade.service';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.scss'
})
export class CheckinComponent implements OnInit {
  evento?: Evento;
  participantes: Participante[] = [];
  checados = new Set<number>([1, 3]);

  constructor(
    private route: ActivatedRoute,
    private eventosService: EventosService,
    private comunidadeService: ComunidadeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventosService.listar().subscribe(eventos => {
      this.evento = eventos.find(e => e.id === id) ?? eventos[0];
    });
    this.comunidadeService.listarParticipantes().subscribe(p => this.participantes = p);
  }

  get percentualPresenca(): number {
    if (this.participantes.length === 0) return 0;
    return Math.round((this.checados.size / this.participantes.length) * 100);
  }

  toggle(id: number): void {
    if (this.checados.has(id)) {
      this.checados.delete(id);
    } else {
      this.checados.add(id);
    }
  }
}
