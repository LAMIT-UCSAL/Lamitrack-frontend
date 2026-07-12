import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Evento } from '../../../core/models/evento.model';
import { CategoriaBadgeClassPipe } from '../../pipes/categoria-badge-class.pipe';

const INTERVALO_MS = 4000;

@Component({
  selector: 'app-carrossel-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink, CategoriaBadgeClassPipe],
  templateUrl: './carrossel-eventos.component.html',
  styleUrl: './carrossel-eventos.component.scss'
})
export class CarrosselEventosComponent implements OnInit, OnDestroy {
  @Input({ required: true }) eventos: Evento[] = [];
  activeIndex = 0;

  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.iniciarAutoAvanco();
  }

  ngOnDestroy(): void {
    this.pararAutoAvanco();
  }

  proximo(): void {
    if (this.eventos.length === 0) return;
    this.activeIndex = (this.activeIndex + 1) % this.eventos.length;
  }

  anterior(): void {
    if (this.eventos.length === 0) return;
    this.activeIndex = (this.activeIndex - 1 + this.eventos.length) % this.eventos.length;
  }

  irPara(indice: number): void {
    this.activeIndex = indice;
  }

  pausar(): void {
    this.pararAutoAvanco();
  }

  retomar(): void {
    this.iniciarAutoAvanco();
  }

  private iniciarAutoAvanco(): void {
    this.pararAutoAvanco();
    this.intervalId = setInterval(() => this.proximo(), INTERVALO_MS);
  }

  private pararAutoAvanco(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
