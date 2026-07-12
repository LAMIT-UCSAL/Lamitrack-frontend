import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { EventosService } from './eventos.service';
import { Evento } from '../models/evento.model';

describe('EventosService', () => {
  let service: EventosService;
  let httpMock: HttpTestingController;

  const eventoBase: Evento = {
    id: 1,
    titulo: 'Hack Bahia 2025',
    categoria: 'Hackathon',
    descricao: '',
    data: '2025-08-15T09:00:00',
    dataFormatada: '15-17 de Agosto de 2025',
    local: 'SENAI CIMATEC, Salvador',
    capacidadeTotal: 400,
    inscritos: 342,
    precoIngresso: 0,
    organizador: 'SENAI CIMATEC',
    imagemUrl: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventosService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(EventosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('busca a lista de eventos em assets/data/eventos.json', () => {
    service.listar().subscribe(eventos => expect(eventos).toEqual([eventoBase]));
    const req = httpMock.expectOne('assets/data/eventos.json');
    expect(req.request.method).toBe('GET');
    req.flush([eventoBase]);
  });

  it('calcula o percentual de ocupação corretamente', () => {
    expect(service.calcularOcupacao(eventoBase)).toBe(86);
  });

  it('não gera receita para evento gratuito', () => {
    expect(service.calcularReceitaProjetada(eventoBase)).toBe(0);
    expect(service.calcularComissaoPlataforma(eventoBase)).toBe(0);
    expect(service.calcularReceitaLiquida(eventoBase)).toBe(0);
  });

  it('calcula receita projetada, comissão de 5% e receita líquida para evento pago', () => {
    const eventoPago: Evento = { ...eventoBase, inscritos: 89, capacidadeTotal: 150, precoIngresso: 25 };

    expect(service.calcularReceitaProjetada(eventoPago)).toBe(2225);
    expect(service.calcularComissaoPlataforma(eventoPago)).toBeCloseTo(111.25, 2);
    expect(service.calcularReceitaLiquida(eventoPago)).toBeCloseTo(2113.75, 2);
  });

  it('arredonda a ocupação para o inteiro mais próximo', () => {
    const evento = { ...eventoBase, inscritos: 1, capacidadeTotal: 3 };
    expect(service.calcularOcupacao(evento)).toBe(33);
  });
});
