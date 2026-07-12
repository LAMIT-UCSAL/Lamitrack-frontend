import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { CadastroComponent } from './cadastro.component';
import { AuthService } from '../../../core/services/auth.service';

describe('CadastroComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [CadastroComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({}) } } }
      ]
    });
  });

  afterEach(() => localStorage.clear());

  it('cadastra, loga automaticamente e navega para o destino padrão do papel', () => {
    const router = TestBed.inject(Router);
    const authService = TestBed.inject(AuthService);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const componente = TestBed.createComponent(CadastroComponent).componentInstance;

    componente.form.setValue({ nome: 'Maria Silva', email: 'maria@example.com', senha: 'senha123', tipo: 'organizador' });
    componente.cadastrar();

    expect(componente.emailDuplicado).toBeFalse();
    expect(authService.estaAutenticado()).toBeTrue();
    expect(authService.usuarioAtual?.nome).toBe('Maria Silva');
    expect(navigateSpy).toHaveBeenCalledWith('/organizador/dashboard');
  });

  it('bloqueia e-mail já cadastrado e não sobrescreve a conta existente', () => {
    const authService = TestBed.inject(AuthService);
    authService.cadastrar('Primeira Conta', 'duplicado@example.com', 'senhaoriginal', 'participante');
    authService.sair();

    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const componente = TestBed.createComponent(CadastroComponent).componentInstance;

    componente.form.setValue({ nome: 'Segunda Conta', email: 'duplicado@example.com', senha: 'outrasenha', tipo: 'organizador' });
    componente.cadastrar();

    expect(componente.emailDuplicado).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(authService.entrar('duplicado@example.com', 'senhaoriginal')).toBeTrue();
  });

  it('respeita o redirectTo quando presente', () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { queryParamMap: convertToParamMap({ redirectTo: '/organizador/checkin/1' }) } }
    });

    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const componente = TestBed.createComponent(CadastroComponent).componentInstance;

    componente.form.setValue({ nome: 'Ana Costa', email: 'ana@example.com', senha: 'senha123', tipo: 'organizador' });
    componente.cadastrar();

    expect(navigateSpy).toHaveBeenCalledWith('/organizador/checkin/1');
  });
});
