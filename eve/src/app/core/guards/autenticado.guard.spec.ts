import { TestBed } from '@angular/core/testing';
import { UrlTree, provideRouter } from '@angular/router';
import { autenticadoGuard } from './autenticado.guard';
import { AuthService } from '../services/auth.service';

describe('autenticadoGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
  });

  afterEach(() => localStorage.clear());

  function executarGuard() {
    return TestBed.runInInjectionContext(() =>
      autenticadoGuard({} as any, { url: '/comunidade' } as any)
    );
  }

  it('permite o acesso para qualquer papel autenticado (participante)', () => {
    const authService = TestBed.inject(AuthService);
    authService.cadastrar('Ana Costa', 'ana@example.com', 'senha123', 'participante');

    expect(executarGuard()).toBeTrue();
  });

  it('permite o acesso para organizador também', () => {
    const authService = TestBed.inject(AuthService);
    authService.cadastrar('Maria Silva', 'maria@example.com', 'senha123', 'organizador');

    expect(executarGuard()).toBeTrue();
  });

  it('redireciona para /entrar com redirectTo quando não autenticado', () => {
    const resultado = executarGuard();

    expect(resultado).not.toBe(true);
    const urlTree = resultado as UrlTree;
    expect(urlTree.toString()).toContain('/entrar');
    expect(urlTree.queryParams['redirectTo']).toBe('/comunidade');
  });
});
