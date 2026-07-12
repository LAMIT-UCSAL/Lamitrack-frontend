import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Evento } from '../../../core/models/evento.model';
import { EventosService } from '../../../core/services/eventos.service';
import { CategoriaBadgeClassPipe } from '../../../shared/pipes/categoria-badge-class.pipe';

interface MetricasEvento {
  evento: Evento;
  ocupacao: number;
  receitaProjetada: number;
  comissao: number;
  receitaLiquida: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CategoriaBadgeClassPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  metricas: MetricasEvento[] = [];
  resumo = { totalInscritos: 0, receitaTotal: 0, comissaoTotal: 0, liquidoTotal: 0 };

  constructor(private eventosService: EventosService, private router: Router) {}

  ngOnInit(): void {
    this.eventosService.listar().subscribe(eventos => {
      const organizadorEventos = eventos.slice(0, 3);
      this.metricas = organizadorEventos.map(evento => ({
        evento,
        ocupacao: this.eventosService.calcularOcupacao(evento),
        receitaProjetada: this.eventosService.calcularReceitaProjetada(evento),
        comissao: this.eventosService.calcularComissaoPlataforma(evento),
        receitaLiquida: this.eventosService.calcularReceitaLiquida(evento)
      }));

      this.resumo = this.metricas.reduce((acc, m) => ({
        totalInscritos: acc.totalInscritos + m.evento.inscritos,
        receitaTotal: acc.receitaTotal + m.receitaProjetada,
        comissaoTotal: acc.comissaoTotal + m.comissao,
        liquidoTotal: acc.liquidoTotal + m.receitaLiquida
      }), { totalInscritos: 0, receitaTotal: 0, comissaoTotal: 0, liquidoTotal: 0 });
    });
  }

  irParaCheckin(evento: Evento): void {
    this.router.navigate(['/organizador/checkin', evento.id]);
  }
}
