import { CategoriaRepository } from './categoria.repository';
import { ICategoryCreate, ICategoryUpdate } from '../models/categoria.dto';

export class CategoriaService {
  static list() {
    return CategoriaRepository.list();
  }
  static getById(id: number) {
    return CategoriaRepository.findById(id);
  }
  static create(dto: ICategoryCreate) {
    return CategoriaRepository.create(dto);
  }
  static update(id: number, dto: ICategoryUpdate) {
    return CategoriaRepository.update(id, dto);
  }
  static delete(id: number) {
    return CategoriaRepository.remove(id);
  }
  static getServicios(id: number) {
    // ya lo tienes: find servicios por categoria
    return prisma.servicio.findMany({ where: { categoria_id: id } });
  }
}
