import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Evento } from '../../../core/models/evento.model';

@Component({
  selector: 'app-evento-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './evento-card.component.html',
  styleUrl: './evento-card.component.scss'
})
export class EventoCardComponent {
  @Input({ required: true }) evento!: Evento;

  get badgeCategoriaClass(): string {
    return 'badge-cat badge-cat-' + this.evento.categoria.toLowerCase();
  }
}
