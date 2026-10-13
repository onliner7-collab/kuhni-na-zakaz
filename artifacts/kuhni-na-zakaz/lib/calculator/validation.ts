import { z } from "zod";
export const selectionSchema = z.object({
  layout: z.enum(["straight", "corner", "u_shape"]),
  lengths: z.array(z.string().max(12)).length(3),
  approximate: z.boolean(), undecided: z.boolean(),
  material: z.enum(["mdf_film", "ldsp", "plastic", "enamel"]),
  upper: z.enum(["standard", "ceiling", "none"]),
  countertop: z.enum(["laminate", "acrylic", "quartz"]),
  hardware: z.enum(["basic", "soft_close"]),
}).strict();
