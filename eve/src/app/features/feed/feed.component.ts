import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Video } from '../../core/models/video.model';
import { VideosService } from '../../core/services/videos.service';
import { CategoriaBadgeClassPipe } from '../../shared/pipes/categoria-badge-class.pipe';
import { AuthService } from '../../core/services/auth.service';

type ModoOrdenacao = 'recentes' | 'engajamento';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CategoriaBadgeClassPipe],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit, AfterViewInit, OnDestroy {
  videos: Video[] = [];
  sortMode: ModoOrdenacao = 'recentes';
  activeVideoId: number | null = null;
  comentarioAbertoId: number | null = null;
  novoComentario = '';

  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('videoEl') videoEls!: QueryList<ElementRef<HTMLVideoElement>>;

  private readonly visualizadosVistos = new Set<number>();
  private observer?: IntersectionObserver;
  private queryListSub?: { unsubscribe(): void };
  private scrollendHandler = () => this.corrigirSnap();

  constructor(
    private videosService: VideosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.videosService.listarVideos().subscribe(videos => this.videos = videos);
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(entries => this.aoInterceptar(entries), { threshold: [0.6] });
    this.observarTodosVideos();
    this.queryListSub = this.videoEls.changes.subscribe(() => this.observarTodosVideos());
    this.containerRef.nativeElement.addEventListener('scrollend', this.scrollendHandler);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.queryListSub?.unsubscribe();
    this.containerRef?.nativeElement.removeEventListener('scrollend', this.scrollendHandler);
  }

  get sortedVideos(): Video[] {
    if (this.sortMode === 'recentes') return this.videos;
    return [...this.videos].sort((a, b) => (b.curtidas + b.comentarios.length) - (a.curtidas + a.comentarios.length));
  }

  trackByVideoId(_index: number, video: Video): number {
    return video.id;
  }

  definirOrdenacao(modo: ModoOrdenacao): void {
    this.sortMode = modo;
  }

  alternarCurtida(video: Video): void {
    if (!this.exigirLogin()) return;
    video.curtido = !video.curtido;
    video.curtidas += video.curtido ? 1 : -1;
  }

  abrirComentarios(video: Video): void {
    this.comentarioAbertoId = this.comentarioAbertoId === video.id ? null : video.id;
    this.novoComentario = '';
  }

  publicarComentario(video: Video): void {
    if (!this.exigirLogin()) return;
    const texto = this.novoComentario.trim();
    if (!texto) return;
    video.comentarios = [{
      id: video.comentarios.length + 1,
      autor: 'Você',
      iniciais: 'VC',
      mensagem: texto,
      tempo: 'agora mesmo'
    }, ...video.comentarios];
    this.novoComentario = '';
  }

  alternarSom(): void {
    const ref = this.videoEls.find(r => this.idDoElemento(r.nativeElement) === this.activeVideoId);
    if (!ref) return;
    ref.nativeElement.muted = !ref.nativeElement.muted;
  }

  private observarTodosVideos(): void {
    if (!this.observer) return;
    this.observer.disconnect();
    this.videoEls.forEach(ref => this.observer!.observe(ref.nativeElement));
  }

  private aoInterceptar(entries: IntersectionObserverEntry[]): void {
    const maisVisivel = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!maisVisivel) return;
    const id = this.idDoElemento(maisVisivel.target as HTMLVideoElement);
    if (id !== null) this.ativarVideo(id);
  }

  private ativarVideo(id: number): void {
    if (this.activeVideoId === id) return;
    this.activeVideoId = id;

    if (!this.visualizadosVistos.has(id)) {
      this.visualizadosVistos.add(id);
      const video = this.videos.find(v => v.id === id);
      if (video) video.visualizacoes++;
    }

    this.videoEls.forEach(ref => {
      const el = ref.nativeElement;
      if (this.idDoElemento(el) === id) {
        el.muted = true;
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }

  private corrigirSnap(): void {
    const container = this.containerRef.nativeElement;
    const slides = Array.from(container.querySelectorAll<HTMLElement>('.feed-slide'));
    const containerTop = container.scrollTop;
    let maisProximo: HTMLElement | null = null;
    let menorDistancia = Infinity;
    for (const slide of slides) {
      const distancia = Math.abs(slide.offsetTop - containerTop);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        maisProximo = slide;
      }
    }
    if (maisProximo && menorDistancia > 4) {
      maisProximo.scrollIntoView({ block: 'start' });
    }
  }

  private idDoElemento(el: HTMLVideoElement): number | null {
    const raw = el.dataset['videoId'];
    return raw ? Number(raw) : null;
  }

  /** Retorna true se autenticado; senão redireciona para o login e retorna false. */
  private exigirLogin(): boolean {
    if (this.authService.estaAutenticado()) return true;
    this.router.navigate(['/entrar'], { queryParams: { redirectTo: '/feed' } });
    return false;
  }
}
