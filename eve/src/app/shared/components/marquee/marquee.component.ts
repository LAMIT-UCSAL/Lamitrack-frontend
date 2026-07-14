import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marquee.component.html',
  styleUrl: './marquee.component.scss',
})
export class MarqueeComponent implements AfterViewInit, OnDestroy {
  @Input() items: unknown[] = [];
  @Input() itemTemplate!: TemplateRef<unknown>;
  @Input() velocidade = 40;
  @Input() velocidadeHover = 14;
  @Input() mostrarDivisores = true;
  @Input() blurCompacto = false;
  @Input() gapCompacto = false;
  @Input() alinharBase = false;

  readonly camadasBlur = [0, 1, 2, 3, 4, 5];

  @ViewChild('track') private trackRef!: ElementRef<HTMLElement>;
  @ViewChildren('itemEl') private itemEls!: QueryList<ElementRef<HTMLElement>>;

  private posicao = 0;
  private periodo = 0;
  private velocidadeAtual = 0;
  private velocidadeAlvo = 0;
  private ultimoTimestamp = 0;
  private frameId = 0;
  private destruido = false;
  private reduzMovimento = false;
  private resizeObserver?: ResizeObserver;

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    this.reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.velocidadeAtual = this.reduzMovimento ? 0 : this.velocidade;
    this.velocidadeAlvo = this.velocidadeAtual;

    this.zone.runOutsideAngular(() => {
      this.medirPeriodo();
      this.resizeObserver = new ResizeObserver(() => this.medirPeriodo());
      this.resizeObserver.observe(this.trackRef.nativeElement);
      this.frameId = requestAnimationFrame(this.animar);
    });
  }

  /**
   * Mede a distância real (em px) entre o início do primeiro item e o início
   * do primeiro item duplicado — só isso garante um loop sem corte quando os
   * itens têm `gap`/larguras variáveis; `scrollWidth / 2` erra por meio `gap`.
   */
  private medirPeriodo(): void {
    const n = this.items.length;
    if (n === 0) return;
    const els = this.itemEls.toArray();
    if (els.length < n * 2) return;

    const inicio = els[0].nativeElement.offsetLeft;
    const inicioDuplicado = els[n].nativeElement.offsetLeft;
    const novoPeriodo = inicioDuplicado - inicio;

    if (novoPeriodo > 0) {
      if (this.periodo > 0 && Math.abs(this.posicao) > novoPeriodo) {
        this.posicao = this.posicao % novoPeriodo;
      }
      this.periodo = novoPeriodo;
    }
  }

  private readonly animar = (timestamp: number) => {
    if (this.destruido) return;
    if (!this.ultimoTimestamp) this.ultimoTimestamp = timestamp;
    const delta = Math.min((timestamp - this.ultimoTimestamp) / 1000, 0.1);
    this.ultimoTimestamp = timestamp;

    if (!this.reduzMovimento) {
      this.velocidadeAtual += (this.velocidadeAlvo - this.velocidadeAtual) * Math.min(1, delta * 4);
      this.posicao -= this.velocidadeAtual * delta;

      if (this.periodo > 0 && Math.abs(this.posicao) >= this.periodo) {
        this.posicao += this.periodo;
      }
      this.trackRef.nativeElement.style.transform = `translateX(${this.posicao}px)`;
    }

    this.frameId = requestAnimationFrame(this.animar);
  };

  aoEntrarMouse(): void {
    this.velocidadeAlvo = this.reduzMovimento ? 0 : this.velocidadeHover;
  }

  aoSairMouse(): void {
    this.velocidadeAlvo = this.reduzMovimento ? 0 : this.velocidade;
  }

  estiloCamada(indice: number, direcao: 'left' | 'right'): Record<string, string> {
    const totalCamadas = this.camadasBlur.length;
    const segmento = 1 / (totalCamadas + 1);
    const stops = [indice, indice + 1, indice + 2, indice + 3].map(
      (v) => `${(v * segmento * 100).toFixed(2)}%`,
    );
    const angulo = direcao === 'left' ? 270 : 90;
    const gradiente = `linear-gradient(${angulo}deg, rgba(255,255,255,0) ${stops[0]}, rgba(255,255,255,1) ${stops[1]}, rgba(255,255,255,1) ${stops[2]}, rgba(255,255,255,0) ${stops[3]})`;
    const blur = `${(indice * 1.1).toFixed(1)}px`;

    return {
      'mask-image': gradiente,
      '-webkit-mask-image': gradiente,
      'backdrop-filter': `blur(${blur})`,
      '-webkit-backdrop-filter': `blur(${blur})`,
    };
  }

  ngOnDestroy(): void {
    this.destruido = true;
    cancelAnimationFrame(this.frameId);
    this.resizeObserver?.disconnect();
  }
}
