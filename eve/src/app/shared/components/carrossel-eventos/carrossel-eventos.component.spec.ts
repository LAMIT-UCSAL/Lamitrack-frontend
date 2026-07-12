import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CarrosselEventosComponent } from './carrossel-eventos.component';
import { Evento } from '../../../core/models/evento.model';

describe('CarrosselEventosComponent', () => {
  function criarEventosMock(): Evento[] {
    return [1, 2, 3].map(id => ({
      id, titulo: `Evento ${id}`, categoria: 'Hackathon', descricao: '', data: '2026-01-01', dataFormatada: '1 de Janeiro de 2026',
      local: 'Local', capacidadeTotal: 100, inscritos: 10, precoIngresso: 0, organizador: 'Org', imagemUrl: ''
    }));
  }

  function criarComponente(): CarrosselEventosComponent {
    TestBed.configureTestingModule({
      imports: [CarrosselEventosComponent],
      providers: [provideRouter([])]
    });
    const fixture = TestBed.createComponent(CarrosselEventosComponent);
    fixture.componentInstance.eventos = criarEventosMock();
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('avança automaticamente a cada 4 segundos', fakeAsync(() => {
    const componente = criarComponente();
    expect(componente.activeIndex).toBe(0);

    tick(4000);
    expect(componente.activeIndex).toBe(1);

    tick(4000);
    expect(componente.activeIndex).toBe(2);

    discardPeriodicTasks();
  }));

  it('volta pro primeiro slide após o último (wrap-around)', fakeAsync(() => {
    const componente = criarComponente();

    tick(4000 * 3);
    expect(componente.activeIndex).toBe(0);

    discardPeriodicTasks();
  }));

  it('pausar() interrompe o avanço automático', fakeAsync(() => {
    const componente = criarComponente();
    componente.pausar();

    tick(8000);
    expect(componente.activeIndex).toBe(0);

    discardPeriodicTasks();
  }));

  it('navega manualmente com proximo/anterior/irPara', fakeAsync(() => {
    const componente = criarComponente();
    componente.pausar();

    componente.proximo();
    expect(componente.activeIndex).toBe(1);

    componente.anterior();
    expect(componente.activeIndex).toBe(0);

    componente.irPara(2);
    expect(componente.activeIndex).toBe(2);

    discardPeriodicTasks();
  }));
});
