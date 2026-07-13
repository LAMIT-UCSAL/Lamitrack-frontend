import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { DetalheEventoComponent } from './detalhe-evento.component';
import { EventosService } from '../../../core/services/eventos.service';
import { InscricoesService } from '../../../core/services/inscricoes.service';
import { AuthService } from '../../../core/services/auth.service';
import { Evento } from '../../../core/models/evento.model';

describe('DetalheEventoComponent', () => {
  const eventoMock: Evento = {
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

  let inscricoesServiceSpy: jasmine.SpyObj<InscricoesService>;

  function criarComponente(): DetalheEventoComponent {
    const fixture = TestBed.createComponent(DetalheEventoComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  beforeEach(() => {
    localStorage.clear();
    inscricoesServiceSpy = jasmine.createSpyObj('InscricoesService', ['criar']);

    TestBed.configureTestingModule({
      imports: [DetalheEventoComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
        { provide: EventosService, useValue: { listar: () => of([eventoMock]) } },
        { provide: InscricoesService, useValue: inscricoesServiceSpy }
      ]
    });
  });

  afterEach(() => localStorage.clear());

  it('carrega o evento correspondente ao :id da rota', () => {
    const componente = criarComponente();
    expect(componente.evento?.titulo).toBe('Hack Bahia 2025');
  });

  it('não avança para a etapa de consentimento com nome ou e-mail inválidos', () => {
    const componente = criarComponente();
    componente.avancarParaConsentimento();
    expect(componente.etapa).toBe('dados');
  });

  it('não avança para a etapa de consentimento com CPF preenchido incorretamente', () => {
    const componente = criarComponente();
    componente.form.patchValue({ nome: 'Maria Silva', email: 'maria@example.com', cpf: '123' });
    componente.avancarParaConsentimento();
    expect(componente.etapa).toBe('dados');
    expect(componente.cpf?.hasError('cpfInvalido')).toBeTrue();
  });

  it('avança para consentimento com CPF vazio (opcional) ou com 11 dígitos válidos', () => {
    const componente = criarComponente();
    componente.form.patchValue({ nome: 'Maria Silva', email: 'maria@example.com', cpf: '' });
    componente.avancarParaConsentimento();
    expect(componente.etapa).toBe('consentimento');

    componente.voltarParaDados();
    componente.form.patchValue({ cpf: '123.456.789-00' });
    componente.avancarParaConsentimento();
    expect(componente.etapa).toBe('consentimento');
  });

  it('não confirma a inscrição sem o aceite da LGPD', () => {
    const componente = criarComponente();
    componente.form.patchValue({ nome: 'Maria Silva', email: 'maria@example.com', aceiteLgpd: false });
    componente.confirmarInscricao();

    expect(componente.inscricaoConfirmada).toBeFalse();
    expect(inscricoesServiceSpy.criar).not.toHaveBeenCalled();
  });

  it('confirma a inscrição e gera o número do ingresso quando o formulário é válido', () => {
    const componente = criarComponente();
    componente.form.patchValue({ nome: 'Maria Silva', email: 'maria@example.com', aceiteLgpd: true });
    componente.confirmarInscricao();

    expect(componente.inscricaoConfirmada).toBeTrue();
    expect(componente.numeroIngresso).toMatch(/^EVE-1\d{4}$/);
    expect(inscricoesServiceSpy.criar).toHaveBeenCalledWith(jasmine.objectContaining({
      eventoId: 1,
      nome: 'Maria Silva',
      email: 'maria@example.com',
      aceiteLgpd: true
    }));
  });

  it('calcula o percentual de ocupação e as vagas restantes a partir do evento carregado', () => {
    const componente = criarComponente();
    expect(componente.percentualOcupacao).toBe(86);
    expect(componente.vagasRestantes).toBe(58);
  });

  it('exige login para se inscrever: sem sessão, mostra CTA de login em vez do formulário', () => {
    const componente = criarComponente();
    expect(componente.estaAutenticado).toBeFalse();
  });

  it('com sessão ativa, libera o formulário e pré-preenche nome/e-mail do usuário', () => {
    const authService = TestBed.inject(AuthService);
    authService.cadastrar('Maria Silva', 'maria@example.com', 'senha123', 'participante');

    const componente = criarComponente();
    expect(componente.estaAutenticado).toBeTrue();
    expect(componente.nome?.value).toBe('Maria Silva');
    expect(componente.email?.value).toBe('maria@example.com');
  });
});
