import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Evento, CategoriaEvento } from '../../core/models/evento.model';
import { EventosService } from '../../core/services/eventos.service';
import { EventoCardComponent } from '../../shared/components/evento-card/evento-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EventoCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  categorias: (CategoriaEvento | 'Todos')[] = ['Todos', 'Hackathon', 'Ideathon', 'Maratona', 'Edital'];
  categoriaAtiva: CategoriaEvento | 'Todos' = 'Todos';

  stats = [
    { label: 'Eventos ativos', value: '18' },
    { label: 'Inscrições realizadas', value: '1.053' },
    { label: 'Organizadores parceiros', value: '12' },
    { label: 'Comunidades ativas', value: '18' }
  ];

  constructor(private eventosService: EventosService, private router: Router) {}

  ngOnInit(): void {
    this.eventosService.listar().subscribe(eventos => {
      this.eventos = eventos;
      this.eventosFiltrados = eventos;
    });
  }

  filtrar(categoria: CategoriaEvento | 'Todos'): void {
    this.categoriaAtiva = categoria;
    this.eventosFiltrados = categoria === 'Todos'
      ? this.eventos
      : this.eventos.filter(e => e.categoria === categoria);
  }

  irParaEventos(): void {
    this.router.navigate(['/eventos']);
  }
}
