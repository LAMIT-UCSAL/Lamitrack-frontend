import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Evento, CategoriaEvento } from '../../core/models/evento.model';
import { EventosService } from '../../core/services/eventos.service';
import { ComunidadeService } from '../../core/services/comunidade.service';
import { AuthService } from '../../core/services/auth.service';
import { EventoCardComponent } from '../../shared/components/evento-card/evento-card.component';
import { GloboEveComponent } from '../../shared/components/globo-eve/globo-eve.component';
import { MarqueeComponent } from '../../shared/components/marquee/marquee.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EventoCardComponent, GloboEveComponent, MarqueeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  categorias: (CategoriaEvento | 'Todos')[] = ['Todos', 'Hackathon', 'Ideathon', 'Maratona', 'Edital', 'Eventos de Inovação'];
  categoriaAtiva: CategoriaEvento | 'Todos' = 'Todos';

  stats: { label: string; value: string }[] = [];

  parceiros = [
    { nome: 'GDG Salvador', logo: 'assets/img/GDG Salvador.svg' },
    { nome: 'GDG Lauro de Freitas', logo: 'assets/img/GDG Lauro.svg' },
    { nome: 'NXOS', logo: 'assets/img/NXOS.svg' },
    { nome: 'SCUPP', logo: 'assets/img/SCUPP.svg' },
    { nome: 'Stem', logo: 'assets/img/Stem.svg' },
    { nome: 'Rádio', logo: 'assets/img/radio.svg' },
    { nome: 'Red Bull', logo: 'assets/img/redbull.svg' },
    { nome: 'Rocketseat', logo: 'assets/img/rocketseat.svg' }
  ];

  constructor(
    private eventosService: EventosService,
    private comunidadeService: ComunidadeService,
    private authService: AuthService,
    private router: Router
  ) {}

  get usuario() {
    return this.authService.usuarioAtual;
  }

  ngOnInit(): void {
    combineLatest([
      this.eventosService.listar(),
      this.comunidadeService.listarParticipantes()
    ]).subscribe(([eventos, participantes]) => {
      this.eventos = eventos;
      this.eventosFiltrados = eventos;

      const inscricoesTotais = eventos.reduce((soma, e) => soma + e.inscritos, 0);
      const organizadoresUnicos = new Set(eventos.map(e => e.organizador)).size;
      const comunidadesAtivas = new Set(participantes.map(p => p.eventoId)).size;

      this.stats = [
        { label: 'Eventos ativos', value: String(eventos.length) },
        { label: 'Inscrições realizadas', value: inscricoesTotais.toLocaleString('pt-BR') },
        { label: 'Organizadores parceiros', value: String(organizadoresUnicos) },
        { label: 'Comunidades ativas', value: String(comunidadesAtivas) }
      ];
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

  irParaOrganizadores(): void {
    this.router.navigate(['/organizador/dashboard']);
  }
}
