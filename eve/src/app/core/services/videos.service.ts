import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from '../models/video.model';

@Injectable({ providedIn: 'root' })
export class VideosService {
  constructor(private http: HttpClient) {}

  listarVideos(): Observable<Video[]> {
    return this.http.get<Video[]>('assets/data/videos.json');
  }
}
