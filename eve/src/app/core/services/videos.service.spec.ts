import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { VideosService } from './videos.service';
import { Video } from '../models/video.model';

describe('VideosService', () => {
  let service: VideosService;
  let httpMock: HttpTestingController;

  const videoBase: Video = {
    id: 1,
    eventoId: 1,
    categoria: 'Hackathon',
    titulo: 'Chamada oficial — Hack Bahia 2025',
    organizador: 'SENAI CIMATEC',
    videoUrl: 'assets/video/evento-bunny.mp4',
    visualizacoes: 1284,
    curtidas: 96,
    comentarios: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideosService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(VideosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('busca a lista de vídeos em assets/data/videos.json', () => {
    service.listarVideos().subscribe(videos => expect(videos).toEqual([videoBase]));
    const req = httpMock.expectOne('assets/data/videos.json');
    expect(req.request.method).toBe('GET');
    req.flush([videoBase]);
  });
});
