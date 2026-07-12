import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { organizadorGuard } from './organizador.guard';
import { AuthService } from '../services/auth.service';

describe('organizadorGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
  });

  afterEach(() => localStorage.clear());

  function executarGuard() {
    return TestBed.runInInjectionContext(() =>
      organizadorGuard({} as any, { url: '/organizador/dashboard' } as any)
    );
  }

  it('permite o acesso quando o usuário está autenticado', () => {
    const authService = TestBed.inject(AuthService);
    authService.entrar('Maria Silva', 'maria@example.com');

    expect(executarGuard()).toBeTrue();
  });

  it('redireciona para /entrar com redirectTo quando não autenticado', () => {
    const resultado = executarGuard();

    expect(resultado).not.toBe(true);
    const urlTree = resultado as UrlTree;
    expect(urlTree.toString()).toContain('/entrar');
    expect(urlTree.queryParams['redirectTo']).toBe('/organizador/dashboard');
  });
});
