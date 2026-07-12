import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { EntrarComponent } from './entrar.component';
import { AuthService } from '../../../core/services/auth.service';

describe('EntrarComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [EntrarComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({}) } } }
      ]
    });
  });

  afterEach(() => localStorage.clear());

  it('mostra erro e não navega quando as credenciais não batem com nenhuma conta', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const componente = TestBed.createComponent(EntrarComponent).componentInstance;

    componente.form.setValue({ email: 'naoexiste@example.com', senha: '123456' });
    componente.entrar();

    expect(componente.erroCredenciais).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('entra e navega para o destino padrão do papel quando não há redirectTo', () => {
    const authService = TestBed.inject(AuthService);
    authService.cadastrar('Maria Silva', 'maria@example.com', 'senha123', 'organizador');
    authService.sair();

    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const componente = TestBed.createComponent(EntrarComponent).componentInstance;

    componente.form.setValue({ email: 'maria@example.com', senha: 'senha123' });
    componente.entrar();

    expect(componente.erroCredenciais).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith('/organizador/dashboard');
  });

  it('respeita o redirectTo quando presente', () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { queryParamMap: convertToParamMap({ redirectTo: '/organizador/checkin/1' }) } }
    });

    const authService = TestBed.inject(AuthService);
    authService.cadastrar('João Souza', 'joao@example.com', 'senha123', 'participante');
    authService.sair();

    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const componente = TestBed.createComponent(EntrarComponent).componentInstance;

    componente.form.setValue({ email: 'joao@example.com', senha: 'senha123' });
    componente.entrar();

    expect(navigateSpy).toHaveBeenCalledWith('/organizador/checkin/1');
  });
});
