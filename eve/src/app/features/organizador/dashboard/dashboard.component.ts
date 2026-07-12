import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaEvento, Evento } from '../../../core/models/evento.model';
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
  imports: [CommonModule, ReactiveFormsModule, CategoriaBadgeClassPipe],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  metricas: MetricasEvento[] = [];
  resumo = { totalInscritos: 0, receitaTotal: 0, comissaoTotal: 0, liquidoTotal: 0 };

  readonly categorias: CategoriaEvento[] = ['Hackathon', 'Ideathon', 'Maratona', 'Edital', 'Eventos de Inovação'];

  modalAberto = false;
  form;

  constructor(
    private eventosService: EventosService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['Hackathon' as CategoriaEvento, Validators.required],
      data: ['', Validators.required],
      local: ['', Validators.required],
      capacidadeTotal: [100, [Validators.required, Validators.min(1)]],
      precoIngresso: [0, [Validators.required, Validators.min(0)]],
      descricao: ['', Validators.required]
    });
  }

  get titulo() { return this.form.get('titulo'); }
  get categoria() { return this.form.get('categoria'); }
  get data() { return this.form.get('data'); }
  get local() { return this.form.get('local'); }
  get capacidadeTotal() { return this.form.get('capacidadeTotal'); }
  get precoIngresso() { return this.form.get('precoIngresso'); }
  get descricao() { return this.form.get('descricao'); }

  ngOnInit(): void {
    this.eventosService.listar().subscribe(eventos => {
      const organizadorEventos = eventos.slice(0, 3);
      this.metricas = organizadorEventos.map(evento => this.calcularMetricas(evento));
      this.recalcularResumo();
    });
  }

  irParaCheckin(evento: Evento): void {
    this.router.navigate(['/organizador/checkin', evento.id]);
  }

  abrirModal(): void {
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.form.reset({ titulo: '', categoria: 'Hackathon', data: '', local: '', capacidadeTotal: 100, precoIngresso: 0, descricao: '' });
  }

  criarEvento(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dataIso: string = this.form.value.data!;
    const novoEvento: Evento = {
      id: Date.now(),
      titulo: this.form.value.titulo!,
      categoria: this.form.value.categoria!,
      descricao: this.form.value.descricao!,
      data: dataIso,
      dataFormatada: this.datePipe.transform(dataIso, "d 'de' MMMM 'de' y") || dataIso,
      local: this.form.value.local!,
      capacidadeTotal: this.form.value.capacidadeTotal!,
      inscritos: 0,
      precoIngresso: this.form.value.precoIngresso!,
      organizador: 'Você',
      imagemUrl: 'assets/img/abertura-lamit.png'
    };

    this.metricas = [this.calcularMetricas(novoEvento), ...this.metricas];
    this.recalcularResumo();
    this.fecharModal();
  }

  private calcularMetricas(evento: Evento): MetricasEvento {
    return {
      evento,
      ocupacao: this.eventosService.calcularOcupacao(evento),
      receitaProjetada: this.eventosService.calcularReceitaProjetada(evento),
      comissao: this.eventosService.calcularComissaoPlataforma(evento),
      receitaLiquida: this.eventosService.calcularReceitaLiquida(evento)
    };
  }

  private recalcularResumo(): void {
    this.resumo = this.metricas.reduce((acc, m) => ({
      totalInscritos: acc.totalInscritos + m.evento.inscritos,
      receitaTotal: acc.receitaTotal + m.receitaProjetada,
      comissaoTotal: acc.comissaoTotal + m.comissao,
      liquidoTotal: acc.liquidoTotal + m.receitaLiquida
    }), { totalInscritos: 0, receitaTotal: 0, comissaoTotal: 0, liquidoTotal: 0 });
  }
}
