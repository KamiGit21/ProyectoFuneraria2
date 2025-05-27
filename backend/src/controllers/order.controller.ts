//backend/src/controllers/order.controller.ts
import { Request, Response } from 'express';
import { OrderCreateDto, OrderStatusDto } from '../models/order.dto';
import { OrderService } from '../services/order.service';
import { sendOrderConfirmation } from '../services/mailer';

export const create = async (req: Request, res: Response) => {
  const parsed = OrderCreateDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const order = await OrderService.create(parsed.data);
  await sendOrderConfirmation(parsed.data.clienteId, order.id);
  res.status(201).json(order);
};

export const get = async (req: Request, res: Response) =>
  res.json(await OrderService.get(BigInt(req.params.id)));

export const listMine = async (req: Request, res: Response) =>
  res.json(await OrderService.listByUser(BigInt((req as any).user.id)));

export const changeStatus = async (req: Request, res: Response) => {
  const parsed = OrderStatusDto.safeParse(req.body.estado);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const order = await OrderService.changeStatus(
    BigInt(req.params.id),
    parsed.data
  );
  res.json(order);
};
