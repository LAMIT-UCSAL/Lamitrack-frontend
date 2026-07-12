import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Aviso, Participante } from '../../../core/models/participante.model';
import { ComunidadeService } from '../../../core/services/comunidade.service';

@Component({
  selector: 'app-mural',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mural.component.html',
  styleUrl: './mural.component.scss'
})
export class MuralComponent implements OnInit {
  avisos: Aviso[] = [];
  participantes: Participante[] = [];
  novoAviso = '';

  constructor(private comunidadeService: ComunidadeService) {}

  ngOnInit(): void {
    this.comunidadeService.listarAvisos().subscribe(avisos => this.avisos = [...avisos].reverse());
    this.comunidadeService.listarParticipantes().subscribe(p => this.participantes = p);
  }

  publicarAviso(): void {
    const texto = this.novoAviso.trim();
    if (!texto) return;
    this.avisos = [{
      id: this.avisos.length + 10,
      eventoId: 1,
      autor: 'Organização',
      iniciais: 'OR',
      mensagem: texto,
      tempo: 'agora mesmo'
    }, ...this.avisos];
    this.novoAviso = '';
  }
}
