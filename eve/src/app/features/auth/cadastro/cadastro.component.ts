import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TipoUsuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  form;
  emailDuplicado = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const tipoSugerido = this.route.snapshot.queryParamMap.get('tipo');
    const tipoInicial: TipoUsuario = tipoSugerido === 'organizador' ? 'organizador' : 'participante';

    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      tipo: [tipoInicial, Validators.required]
    });
  }

  get nome() { return this.form.get('nome'); }
  get email() { return this.form.get('email'); }
  get senha() { return this.form.get('senha'); }
  get tipo() { return this.form.get('tipo'); }

  get redirectTo(): string | null {
    return this.route.snapshot.queryParamMap.get('redirectTo');
  }

  get sugeridoParaCriarEventos(): boolean {
    return this.route.snapshot.queryParamMap.get('tipo') === 'organizador';
  }

  selecionarTipo(tipo: TipoUsuario): void {
    this.tipo?.setValue(tipo);
  }

  cadastrar(): void {
    this.emailDuplicado = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email!;
    if (this.authService.emailJaCadastrado(email)) {
      this.emailDuplicado = true;
      return;
    }

    const tipo: TipoUsuario = this.form.value.tipo!;
    this.authService.cadastrar(this.form.value.nome!, email, this.form.value.senha!, tipo);

    const destino = this.redirectTo || (tipo === 'organizador' ? '/organizador/dashboard' : '/');
    this.router.navigateByUrl(destino);
  }
}
