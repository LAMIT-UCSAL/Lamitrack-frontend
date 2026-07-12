import { TestBed } from '@angular/core/testing';
import { InscricoesService } from './inscricoes.service';

describe('InscricoesService', () => {
  let service: InscricoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InscricoesService] });
    service = TestBed.inject(InscricoesService);
  });

  it('cria uma inscrição com id, data e check-in inicial preenchidos automaticamente', () => {
    const inscricao = service.criar({ eventoId: 1, nome: 'Maria Silva', email: 'maria@example.com', aceiteLgpd: true });

    expect(inscricao.id).toBeDefined();
    expect(inscricao.checkinRealizado).toBeFalse();
    expect(new Date(inscricao.dataInscricao).getTime()).not.toBeNaN();
  });

  it('lista apenas as inscrições do evento solicitado', () => {
    service.criar({ eventoId: 1, nome: 'Maria Silva', email: 'maria@example.com', aceiteLgpd: true });
    service.criar({ eventoId: 2, nome: 'Joao Souza', email: 'joao@example.com', aceiteLgpd: true });

    const doEvento1 = service.listarPorEvento(1);
    expect(doEvento1.length).toBe(1);
    expect(doEvento1[0].nome).toBe('Maria Silva');
  });

  it('alterna o status de check-in de uma inscrição existente', () => {
    const inscricao = service.criar({ eventoId: 1, nome: 'Maria Silva', email: 'maria@example.com', aceiteLgpd: true });

    service.alternarCheckin(inscricao.id);
    expect(service.listarPorEvento(1)[0].checkinRealizado).toBeTrue();

    service.alternarCheckin(inscricao.id);
    expect(service.listarPorEvento(1)[0].checkinRealizado).toBeFalse();
  });
});
