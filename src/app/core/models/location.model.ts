import { z } from 'zod';

export const ProvinceSchema = z.object({
  CODE: z.string(),
  NAME: z.string().optional(),
  NAME_NEPALI: z.string().optional(),
});

export type Province = z.infer<typeof ProvinceSchema>;

export interface ProvinceSearchParams {
  fields: Array<keyof Province>;
  page?: number;
  limit?: number;
  search?: string;
}
