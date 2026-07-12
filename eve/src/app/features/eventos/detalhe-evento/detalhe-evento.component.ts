import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import * as QRCode from 'qrcode';
import { Evento } from '../../../core/models/evento.model';
import { EventosService } from '../../../core/services/eventos.service';
import { InscricoesService } from '../../../core/services/inscricoes.service';
import { CategoriaBadgeClassPipe } from '../../../shared/pipes/categoria-badge-class.pipe';

function cpfOpcionalValidator(control: AbstractControl): ValidationErrors | null {
  const valor = (control.value ?? '').trim();
  if (!valor) return null;
  const digitos = valor.replace(/\D/g, '');
  return digitos.length === 11 ? null : { cpfInvalido: true };
}

@Component({
  selector: 'app-detalhe-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CategoriaBadgeClassPipe],
  templateUrl: './detalhe-evento.component.html',
  styleUrl: './detalhe-evento.component.scss'
})
export class DetalheEventoComponent implements OnInit {
  evento?: Evento;
  inscricaoConfirmada = false;
  qrCodeDataUrl = '';
  etapa: 'dados' | 'consentimento' = 'dados';

  form;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventosService: EventosService,
    private inscricoesService: InscricoesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [cpfOpcionalValidator]],
      aceiteLgpd: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventosService.listar().subscribe(eventos => {
      this.evento = eventos.find(e => e.id === id);
    });
  }

  get nome() { return this.form.get('nome'); }
  get email() { return this.form.get('email'); }
  get cpf() { return this.form.get('cpf'); }
  get aceiteLgpd() { return this.form.get('aceiteLgpd'); }

  get percentualOcupacao(): number {
    if (!this.evento) return 0;
    return Math.round((this.evento.inscritos / this.evento.capacidadeTotal) * 100);
  }

  get vagasRestantes(): number {
    if (!this.evento) return 0;
    return this.evento.capacidadeTotal - this.evento.inscritos;
  }

  numeroIngresso = '';

  avancarParaConsentimento(): void {
    this.nome?.markAsTouched();
    this.email?.markAsTouched();
    this.cpf?.markAsTouched();
    if (this.nome?.invalid || this.email?.invalid || this.cpf?.invalid) return;
    this.etapa = 'consentimento';
  }

  voltarParaDados(): void {
    this.etapa = 'dados';
  }

  confirmarInscricao(): void {
    if (this.form.invalid || !this.evento) {
      this.form.markAllAsTouched();
      return;
    }
    this.inscricoesService.criar({
      eventoId: this.evento.id,
      nome: this.form.value.nome!,
      email: this.form.value.email!,
      cpf: this.form.value.cpf ? this.form.value.cpf : undefined,
      aceiteLgpd: this.form.value.aceiteLgpd!
    });
    this.numeroIngresso = `EVE-${this.evento.id}${Math.floor(1000 + Math.random() * 9000)}`;
    this.inscricaoConfirmada = true;
    this.gerarQrCode();
  }

  private gerarQrCode(): void {
    if (!this.evento) return;
    const conteudo = `EVE-CHECKIN|ingresso=${this.numeroIngresso}|evento=${this.evento.titulo}|participante=${this.form.value.nome}`;
    QRCode.toDataURL(conteudo, { width: 176, margin: 1, color: { dark: '#0E1B27', light: '#FFFFFF' } })
      .then(url => this.qrCodeDataUrl = url)
      .catch(() => this.qrCodeDataUrl = '');
  }

  irParaComunidade(): void {
    this.router.navigate(['/comunidade']);
  }
}
