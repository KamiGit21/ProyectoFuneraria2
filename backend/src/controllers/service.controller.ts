// backend/src/controllers/service.controller.ts
import { Request, Response } from 'express';
import {
  ServiceCreateDto,
  ServiceUpdateDto,
  ServiceFilterDto
} from '../models/service.dto';
import { ServiceService } from '../services/service.service';

export const list = async (req: Request, res: Response) => {
  // Primero, si viene `req.query.categoriaId`, lo dejamos tal cual.
  // (El cliente ya envía `?categoriaId=3`.)
  const parsed = ServiceFilterDto.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  const items = await ServiceService.list(parsed.data);
  res.json(items);
};

export const getOne = async (req: Request, res: Response) => {
  const item = await ServiceService.find(BigInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'No existe servicio' });
  res.json(item);
};

export const create = async (req: Request, res: Response) => {
  const parsed = ServiceCreateDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  try {
    const newItem = await ServiceService.create(parsed.data);
    res.status(201).json(newItem);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const parsed = ServiceUpdateDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  try {
    const updated = await ServiceService.update(BigInt(req.params.id), parsed.data);
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  await ServiceService.inactivate(BigInt(req.params.id));
  res.status(204).send();
};
