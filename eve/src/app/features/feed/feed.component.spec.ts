import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FeedComponent } from './feed.component';
import { Video } from '../../core/models/video.model';

describe('FeedComponent', () => {
  let component: FeedComponent;
  let httpMock: HttpTestingController;

  function criarVideosMock(): Video[] {
    return [
      { id: 1, eventoId: 1, categoria: 'Hackathon', titulo: 'A', organizador: 'Org A', videoUrl: '', visualizacoes: 10, curtidas: 5, comentarios: [] },
      {
        id: 2, eventoId: 2, categoria: 'Ideathon', titulo: 'B', organizador: 'Org B', videoUrl: '', visualizacoes: 20, curtidas: 50,
        comentarios: [{ id: 1, autor: 'X', iniciais: 'X', mensagem: 'oi', tempo: 'agora' }]
      }
    ];
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FeedComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    const fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('assets/data/videos.json').flush(criarVideosMock());
  });

  afterEach(() => httpMock.verify());

  it('carrega os vídeos mockados via VideosService', () => {
    expect(component.videos.length).toBe(2);
  });

  it('alterna curtida incrementando e decrementando o contador', () => {
    const video = component.videos[0];
    component.alternarCurtida(video);
    expect(video.curtido).toBeTrue();
    expect(video.curtidas).toBe(6);

    component.alternarCurtida(video);
    expect(video.curtido).toBeFalse();
    expect(video.curtidas).toBe(5);
  });

  it('publica um comentário no topo da lista e limpa o campo de texto', () => {
    const video = component.videos[0];
    component.novoComentario = '  Muito bom! ';
    component.publicarComentario(video);

    expect(video.comentarios.length).toBe(1);
    expect(video.comentarios[0].mensagem).toBe('Muito bom!');
    expect(video.comentarios[0].autor).toBe('Você');
    expect(component.novoComentario).toBe('');
  });

  it('ignora comentário vazio ou só com espaços', () => {
    const video = component.videos[0];
    component.novoComentario = '   ';
    component.publicarComentario(video);
    expect(video.comentarios.length).toBe(0);
  });

  it('ordena por engajamento sem alterar a ordem original em "mais recentes"', () => {
    component.definirOrdenacao('engajamento');
    expect(component.sortedVideos[0].id).toBe(2);

    component.definirOrdenacao('recentes');
    expect(component.sortedVideos[0].id).toBe(1);
  });
});
