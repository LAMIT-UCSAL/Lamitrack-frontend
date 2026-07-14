import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';
import createGlobe, { Globe, Marker } from 'cobe';

@Component({
  selector: 'app-globo-eve',
  standalone: true,
  templateUrl: './globo-eve.component.html',
  styleUrl: './globo-eve.component.scss',
})
export class GloboEveComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() markers: Marker[] = [{ location: [-12.9718, -38.5017], size: 0.09 }];
  @Input() speed = 0.0035;

  private globo?: Globe;
  private resizeObserver?: ResizeObserver;
  private frameId = 0;
  private destruido = false;

  private phi = 0;
  private phiOffset = 0;
  private thetaOffset = 0;
  private dragPhi = 0;
  private dragTheta = 0;
  private pointerInicial: { x: number; y: number } | null = null;
  private pausado = false;

  private readonly aoMoverPonteiro = (evento: PointerEvent) => {
    if (!this.pointerInicial) return;
    this.dragPhi = (evento.clientX - this.pointerInicial.x) / 300;
    this.dragTheta = (evento.clientY - this.pointerInicial.y) / 1000;
  };

  private readonly aoSoltarPonteiro = () => {
    if (this.pointerInicial) {
      this.phiOffset += this.dragPhi;
      this.thetaOffset += this.dragTheta;
      this.dragPhi = 0;
      this.dragTheta = 0;
    }
    this.pointerInicial = null;
    this.pausado = false;
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) canvas.style.cursor = 'grab';
  };

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('pointermove', this.aoMoverPonteiro, { passive: true });
      window.addEventListener('pointerup', this.aoSoltarPonteiro, { passive: true });

      const canvas = this.canvasRef.nativeElement;
      const iniciar = () => {
        if (this.globo || this.destruido) return;
        const largura = canvas.offsetWidth;
        if (largura === 0) return;

        this.globo = createGlobe(canvas, {
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          width: largura,
          height: largura,
          phi: 0,
          theta: 0.28,
          dark: 0,
          diffuse: 1.4,
          mapSamples: 14000,
          mapBrightness: 8,
          baseColor: [0.98, 0.98, 0.97],
          markerColor: [0.04, 0.41, 0.77],
          glowColor: [0.91, 0.95, 0.99],
          markerElevation: 0.02,
          markers: this.markers,
          opacity: 0.9,
        });

        const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const velocidade = reduzMovimento ? 0 : this.speed;

        const animar = () => {
          if (this.destruido) return;
          if (!this.pausado) this.phi += velocidade;
          this.globo?.update({
            phi: this.phi + this.phiOffset + this.dragPhi,
            theta: 0.28 + this.thetaOffset + this.dragTheta,
          });
          this.frameId = requestAnimationFrame(animar);
        };
        animar();

        setTimeout(() => (canvas.style.opacity = '1'));
      };

      if (canvas.offsetWidth > 0) {
        iniciar();
      } else {
        this.resizeObserver = new ResizeObserver((entradas) => {
          if (entradas[0]?.contentRect.width > 0) {
            this.resizeObserver?.disconnect();
            iniciar();
          }
        });
        this.resizeObserver.observe(canvas);
      }
    });
  }

  onPointerDown(evento: PointerEvent): void {
    this.pointerInicial = { x: evento.clientX, y: evento.clientY };
    this.pausado = true;
    this.canvasRef.nativeElement.style.cursor = 'grabbing';
  }

  ngOnDestroy(): void {
    this.destruido = true;
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('pointermove', this.aoMoverPonteiro);
    window.removeEventListener('pointerup', this.aoSoltarPonteiro);
    this.resizeObserver?.disconnect();
    this.globo?.destroy();
  }
}
