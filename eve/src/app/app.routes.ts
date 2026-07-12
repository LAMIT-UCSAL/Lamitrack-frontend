import { Routes } from '@angular/router';
import { organizadorGuard } from './core/guards/organizador.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'eventos',
    loadComponent: () => import('./features/eventos/lista-eventos/lista-eventos.component').then(m => m.ListaEventosComponent)
  },
  {
    path: 'eventos/:id',
    loadComponent: () => import('./features/eventos/detalhe-evento/detalhe-evento.component').then(m => m.DetalheEventoComponent)
  },
  {
    path: 'comunidade',
    loadComponent: () => import('./features/comunidade/mural/mural.component').then(m => m.MuralComponent)
  },
  {
    path: 'organizador/dashboard',
    canActivate: [organizadorGuard],
    loadComponent: () => import('./features/organizador/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'organizador/checkin/:id',
    canActivate: [organizadorGuard],
    loadComponent: () => import('./features/organizador/checkin/checkin.component').then(m => m.CheckinComponent)
  },
  {
    path: 'institucional/privacidade',
    loadComponent: () => import('./features/institucional/privacidade/privacidade.component').then(m => m.PrivacidadeComponent)
  },
  {
    path: 'feed',
    loadComponent: () => import('./features/feed/feed.component').then(m => m.FeedComponent)
  },
  {
    path: 'entrar',
    loadComponent: () => import('./features/auth/entrar/entrar.component').then(m => m.EntrarComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./features/auth/cadastro/cadastro.component').then(m => m.CadastroComponent)
  },
  { path: '**', redirectTo: '' }
];
