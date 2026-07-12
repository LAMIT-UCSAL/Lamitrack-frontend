import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [AuthService] });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  it('não está autenticado por padrão', () => {
    expect(service.estaAutenticado()).toBeFalse();
    expect(service.usuarioAtual).toBeNull();
  });

  it('autentica e persiste o usuário no localStorage', () => {
    service.entrar('Maria Silva', 'maria@example.com');

    expect(service.estaAutenticado()).toBeTrue();
    expect(service.usuarioAtual).toEqual({ nome: 'Maria Silva', email: 'maria@example.com' });

    const salvo = JSON.parse(localStorage.getItem('eve_auth_usuario')!);
    expect(salvo).toEqual({ nome: 'Maria Silva', email: 'maria@example.com' });
  });

  it('carrega o usuário do localStorage ao instanciar o serviço novamente', () => {
    service.entrar('Maria Silva', 'maria@example.com');

    const novoService = new AuthService();
    expect(novoService.estaAutenticado()).toBeTrue();
    expect(novoService.usuarioAtual?.nome).toBe('Maria Silva');
  });

  it('sai e limpa o localStorage', () => {
    service.entrar('Maria Silva', 'maria@example.com');
    service.sair();

    expect(service.estaAutenticado()).toBeFalse();
    expect(service.usuarioAtual).toBeNull();
    expect(localStorage.getItem('eve_auth_usuario')).toBeNull();
  });
});
