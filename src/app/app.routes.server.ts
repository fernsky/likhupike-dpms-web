import { Routes } from '@angular/router';
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client,
  },
  {
    path: 'auth/*',
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard/*',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/*',
    renderMode: RenderMode.Client,
  },
];
