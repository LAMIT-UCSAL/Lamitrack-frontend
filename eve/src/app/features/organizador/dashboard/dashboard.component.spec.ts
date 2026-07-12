import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { Evento } from '../../../core/models/evento.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let httpMock: HttpTestingController;

  function criarEventosMock(): Evento[] {
    return [
      {
        id: 1, titulo: 'Evento A', categoria: 'Hackathon', descricao: '', data: '2026-01-01', dataFormatada: '1 de Janeiro de 2026',
        local: 'Local A', capacidadeTotal: 100, inscritos: 50, precoIngresso: 10, organizador: 'Org A', imagemUrl: ''
      }
    ];
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    });

    const fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('assets/data/eventos.json').flush(criarEventosMock());
  });

  afterEach(() => httpMock.verify());

  it('carrega os eventos e calcula as métricas/resumo', () => {
    expect(component.metricas.length).toBe(1);
    expect(component.metricas[0].ocupacao).toBe(50);
    expect(component.resumo.totalInscritos).toBe(50);
  });

  it('abre e fecha o modal de criar evento', () => {
    component.abrirModal();
    expect(component.modalAberto).toBeTrue();

    component.fecharModal();
    expect(component.modalAberto).toBeFalse();
  });

  it('não cria evento com formulário inválido', () => {
    component.abrirModal();
    component.criarEvento();

    expect(component.metricas.length).toBe(1);
    expect(component.titulo?.touched).toBeTrue();
  });

  it('cria um evento visualmente ao submeter o formulário válido, sem persistência real', () => {
    component.abrirModal();
    component.form.setValue({
      titulo: 'Novo Hackathon',
      categoria: 'Hackathon',
      data: '2026-12-01',
      local: 'UCSAL, Salvador',
      capacidadeTotal: 200,
      precoIngresso: 0,
      descricao: 'Descrição de teste'
    });

    component.criarEvento();

    expect(component.metricas.length).toBe(2);
    expect(component.metricas[0].evento.titulo).toBe('Novo Hackathon');
    expect(component.metricas[0].evento.inscritos).toBe(0);
    expect(component.modalAberto).toBeFalse();
  });
});
