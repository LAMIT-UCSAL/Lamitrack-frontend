import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContaCadastrada, TipoUsuario, UsuarioLogado } from '../models/usuario.model';

const STORAGE_KEY_SESSAO = 'eve_auth_usuario';
const STORAGE_KEY_CONTAS = 'eve_auth_contas';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioSubject = new BehaviorSubject<UsuarioLogado | null>(this.carregarSessao());
  readonly usuario$ = this.usuarioSubject.asObservable();

  get usuarioAtual(): UsuarioLogado | null {
    return this.usuarioSubject.value;
  }

  get ehOrganizador(): boolean {
    return this.usuarioAtual?.tipo === 'organizador';
  }

  estaAutenticado(): boolean {
    return this.usuarioAtual !== null;
  }

  emailJaCadastrado(email: string): boolean {
    return this.carregarContas().some(c => c.email.toLowerCase() === email.toLowerCase());
  }

  cadastrar(nome: string, email: string, senha: string, tipo: TipoUsuario): void {
    const contas = this.carregarContas();
    contas.push({ nome, email, senha, tipo });
    localStorage.setItem(STORAGE_KEY_CONTAS, JSON.stringify(contas));
    this.iniciarSessao({ nome, email, tipo });
  }

  /** Retorna true se as credenciais baterem com uma conta cadastrada e a sessão for iniciada. */
  entrar(email: string, senha: string): boolean {
    const conta = this.carregarContas().find(
      c => c.email.toLowerCase() === email.toLowerCase() && c.senha === senha
    );
    if (!conta) return false;

    this.iniciarSessao({ nome: conta.nome, email: conta.email, tipo: conta.tipo });
    return true;
  }

  sair(): void {
    localStorage.removeItem(STORAGE_KEY_SESSAO);
    this.usuarioSubject.next(null);
  }

  private iniciarSessao(usuario: UsuarioLogado): void {
    localStorage.setItem(STORAGE_KEY_SESSAO, JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  private carregarSessao(): UsuarioLogado | null {
    const bruto = localStorage.getItem(STORAGE_KEY_SESSAO);
    if (!bruto) return null;
    try {
      return JSON.parse(bruto) as UsuarioLogado;
    } catch {
      return null;
    }
  }

  private carregarContas(): ContaCadastrada[] {
    const bruto = localStorage.getItem(STORAGE_KEY_CONTAS);
    if (!bruto) return [];
    try {
      return JSON.parse(bruto) as ContaCadastrada[];
    } catch {
      return [];
    }
  }
}
