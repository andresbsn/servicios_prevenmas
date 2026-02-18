import { z } from "zod";

export const serviceSchema = z.object({
  cliente_id: z.number().int().positive(),
  servicio_id: z.number().int().positive(),
  fecha_servicio: z.string(),
  proximo_vencimiento: z.string(),
  importe: z.number().nonnegative(),
  observacion: z.string().optional().nullable(),
  estado: z.enum(["vigente", "vencido", "cancelado"]).default("vigente")
});
