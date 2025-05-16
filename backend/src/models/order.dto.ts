//backend/src/models/order.dto.ts
import { z } from 'zod';

export const DifuntoDto = z.object({
  nombres:          z.string().min(3).max(100),
  fecha_fallecido:  z.coerce.date()
});

export const OrderCreateDto = z.object({
  servicioId:  z.coerce.number().int().positive(),
  clienteId:   z.coerce.number().int().positive(),
  difunto:     DifuntoDto
});

export const OrderStatusDto = z.enum(['PENDIENTE', 'PROCESO', 'FINALIZADO']);

export type IOrderCreate  = z.infer<typeof OrderCreateDto>;
export type IOrderStatus  = z.infer<typeof OrderStatusDto>;
