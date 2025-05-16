import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.service';
import { CategoryCreateDto, CategoryUpdateDto } from '../models/categoria.dto';

export const listCategorias = async (_: Request, res: Response) => {
  res.json(await CategoriaService.list());
};

export const getCategoria = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cat = await CategoriaService.getById(id);
  if (!cat) return res.status(404).json({ error: 'No existe' });
  res.json(cat);
};

export const createCategoria = async (req: Request, res: Response) => {
  const parsed = CategoryCreateDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  res.status(201).json(await CategoriaService.create(parsed.data));
};

export const updateCategoria = async (req: Request, res: Response) => {
  const parsed = CategoryUpdateDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const id = Number(req.params.id);
  res.json(await CategoriaService.update(id, parsed.data));
};

export const deleteCategoria = async (req: Request, res: Response) => {
  await CategoriaService.delete(Number(req.params.id));
  res.status(204).send();
};

export const listServiciosPorCategoria = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  res.json(await CategoriaService.getServicios(id));
};
