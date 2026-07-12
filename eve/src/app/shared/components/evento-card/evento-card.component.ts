import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Evento } from '../../../core/models/evento.model';
import { CategoriaBadgeClassPipe } from '../../pipes/categoria-badge-class.pipe';

@Component({
  selector: 'app-evento-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CategoriaBadgeClassPipe],
  templateUrl: './evento-card.component.html',
  styleUrl: './evento-card.component.scss'
})
export class EventoCardComponent {
  @Input({ required: true }) evento!: Evento;
}
