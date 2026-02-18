import { z } from "zod";

export const invoiceSchema = z.object({
  cliente_id: z.number().int().positive(),
  descripcion: z.string().min(2),
  importe: z.number().nonnegative(),
  fecha_emision: z.string(),
  estado: z.enum(["PENDIENTE", "COBRADA"]).default("PENDIENTE"),
  fecha_cancelacion: z.string().optional().nullable(),
  observacion: z.string().optional().nullable()
});
