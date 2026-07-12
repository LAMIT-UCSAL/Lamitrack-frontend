import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Evento, CategoriaEvento } from '../../../core/models/evento.model';
import { EventosService } from '../../../core/services/eventos.service';
import { EventoCardComponent } from '../../../shared/components/evento-card/evento-card.component';
import { CarrosselEventosComponent } from '../../../shared/components/carrossel-eventos/carrossel-eventos.component';

@Component({
  selector: 'app-lista-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, EventoCardComponent, CarrosselEventosComponent],
  templateUrl: './lista-eventos.component.html',
  styleUrl: './lista-eventos.component.scss'
})
export class ListaEventosComponent implements OnInit {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  categorias: (CategoriaEvento | 'Todos')[] = ['Todos', 'Hackathon', 'Ideathon', 'Maratona', 'Edital', 'Eventos de Inovação'];
  categoriaAtiva: CategoriaEvento | 'Todos' = 'Todos';
  busca = '';

  constructor(private eventosService: EventosService) {}

  ngOnInit(): void {
    this.eventosService.listar().subscribe(eventos => {
      this.eventos = eventos;
      this.aplicarFiltros();
    });
  }

  filtrar(categoria: CategoriaEvento | 'Todos'): void {
    this.categoriaAtiva = categoria;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const termo = this.busca.toLowerCase().trim();
    this.eventosFiltrados = this.eventos.filter(e => {
      const matchCategoria = this.categoriaAtiva === 'Todos' || e.categoria === this.categoriaAtiva;
      const matchBusca = !termo || e.titulo.toLowerCase().includes(termo) || e.local.toLowerCase().includes(termo);
      return matchCategoria && matchBusca;
    });
  }
}
