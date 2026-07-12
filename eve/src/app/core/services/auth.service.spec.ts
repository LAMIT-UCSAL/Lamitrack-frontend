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
    expect(service.ehOrganizador).toBeFalse();
  });

  it('não reconhece um e-mail que ainda não foi cadastrado', () => {
    expect(service.emailJaCadastrado('maria@example.com')).toBeFalse();
  });

  it('cadastra uma conta, persiste no localStorage e já inicia a sessão', () => {
    service.cadastrar('Maria Silva', 'maria@example.com', 'senha123', 'participante');

    expect(service.estaAutenticado()).toBeTrue();
    expect(service.usuarioAtual).toEqual({ nome: 'Maria Silva', email: 'maria@example.com', tipo: 'participante' });
    expect(service.emailJaCadastrado('maria@example.com')).toBeTrue();
    expect(service.emailJaCadastrado('MARIA@example.com')).toBeTrue();

    const contas = JSON.parse(localStorage.getItem('eve_auth_contas')!);
    expect(contas).toEqual([{ nome: 'Maria Silva', email: 'maria@example.com', senha: 'senha123', tipo: 'participante' }]);

    const sessao = JSON.parse(localStorage.getItem('eve_auth_usuario')!);
    expect(sessao).toEqual({ nome: 'Maria Silva', email: 'maria@example.com', tipo: 'participante' });
  });

  it('entra com sucesso quando e-mail e senha batem com uma conta cadastrada', () => {
    service.cadastrar('João Souza', 'joao@example.com', 'minhasenha', 'organizador');
    service.sair();

    const resultado = service.entrar('joao@example.com', 'minhasenha');

    expect(resultado).toBeTrue();
    expect(service.estaAutenticado()).toBeTrue();
    expect(service.ehOrganizador).toBeTrue();
    expect(service.usuarioAtual?.nome).toBe('João Souza');
  });

  it('recusa o login quando a senha está errada', () => {
    service.cadastrar('João Souza', 'joao@example.com', 'minhasenha', 'organizador');
    service.sair();

    const resultado = service.entrar('joao@example.com', 'senhaerrada');

    expect(resultado).toBeFalse();
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('recusa o login quando o e-mail não está cadastrado', () => {
    const resultado = service.entrar('naoexiste@example.com', 'qualquer');

    expect(resultado).toBeFalse();
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('sai e limpa a sessão, mas mantém a conta cadastrada', () => {
    service.cadastrar('Maria Silva', 'maria@example.com', 'senha123', 'participante');
    service.sair();

    expect(service.estaAutenticado()).toBeFalse();
    expect(service.usuarioAtual).toBeNull();
    expect(localStorage.getItem('eve_auth_usuario')).toBeNull();
    expect(service.emailJaCadastrado('maria@example.com')).toBeTrue();
  });
});
