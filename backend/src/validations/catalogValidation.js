import { z } from "zod";

export const catalogSchema = z.object({
  codigo: z.string().min(2),
  descripcion: z.string().min(2),
  importe_sugerido: z.number().nonnegative().optional().nullable(),
  observacion: z.string().optional().nullable(),
  estado: z.enum(["activo", "inactivo"]).default("activo")
});
