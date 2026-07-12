import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsuarioLogado } from '../models/usuario.model';

const STORAGE_KEY = 'eve_auth_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioSubject = new BehaviorSubject<UsuarioLogado | null>(this.carregarDoStorage());
  readonly usuario$ = this.usuarioSubject.asObservable();

  get usuarioAtual(): UsuarioLogado | null {
    return this.usuarioSubject.value;
  }

  estaAutenticado(): boolean {
    return this.usuarioAtual !== null;
  }

  entrar(nome: string, email: string): void {
    const usuario: UsuarioLogado = { nome, email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  sair(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.usuarioSubject.next(null);
  }

  private carregarDoStorage(): UsuarioLogado | null {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return null;
    try {
      return JSON.parse(bruto) as UsuarioLogado;
    } catch {
      return null;
    }
  }
}
