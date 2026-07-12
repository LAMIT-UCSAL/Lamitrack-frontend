import { Pipe, PipeTransform } from '@angular/core';
import { CategoriaEvento } from '../../core/models/evento.model';

@Pipe({ name: 'categoriaBadgeClass', standalone: true })
export class CategoriaBadgeClassPipe implements PipeTransform {
  transform(categoria: CategoriaEvento): string {
    const slug = categoria
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '-');
    return `badge-cat badge-cat-${slug}`;
  }
}
