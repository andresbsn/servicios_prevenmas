import { z } from "zod";

export const clientSchema = z.object({
  razon_social: z.string().min(2),
  cuit: z.string().min(5),
  email: z.string().email().optional().nullable(),
  telefono: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
  estado: z.enum(["activo", "inactivo"]).default("activo"),
  fecha_alta: z.string().optional().nullable()
});
