import { ServiceRepository } from './service.repository';
import type { IServiceCreate, IServiceUpdate, IServiceFilter } from './service.dto';
import prisma from '../config/prismaClient';

export class ServiceService {
  /** Lista activos con filtros opcionales */
  static list(filters: IServiceFilter) {
    return ServiceRepository.list(filters);
  }

  /** Obtiene uno por ID */
  static find(id: bigint) {
    return ServiceRepository.findById(id);
  }

  /** Crea nuevo servicio, validando categoría si se pasó categoriaId */
  static async create(data: IServiceCreate) {
    if (data.categoriaId) {
      const cat = await prisma.categoria.findUnique({ where: { id: data.categoriaId } });
      if (!cat) {
        throw new Error(`Categoría ${data.categoriaId} inexistente`);
      }
    }
    return ServiceRepository.create(data);
  }

  /** Actualiza servicio existente */
  static async update(id: bigint, data: IServiceUpdate) {
    // validación de categoría al cambiar
    if (data.categoriaId !== undefined && data.categoriaId !== null) {
      const cat = await prisma.categoria.findUnique({ where: { id: data.categoriaId } });
      if (!cat) {
        throw new Error(`Categoría ${data.categoriaId} inexistente`);
      }
    }
    return ServiceRepository.update(id, data);
  }

  /** Marca servicio como inactivo */
  static inactivate(id: bigint) {
    return ServiceRepository.inactivate(id);
  }
}
