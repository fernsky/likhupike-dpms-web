import { z } from 'zod';

export const ProvinceSchema = z.object({
  CODE: z.string(),
  NAME: z.string().optional(),
  NAME_NEPALI: z.string().optional(),
});

export const DistrictSchema = z.object({
  CODE: z.string(),
  PROVINCE_CODE: z.string(),
  NAME: z.string().optional(),
  NAME_NEPALI: z.string().optional(),
});

export const MunicipalitySchema = z.object({
  CODE: z.string(),
  DISTRICT_CODE: z.string(),
  NAME: z.string().optional(),
  NAME_NEPALI: z.string().optional(),
  TYPE: z.enum([
    'MUNICIPALITY',
    'SUB_METROPOLITAN',
    'METROPOLITAN',
    'RURAL_MUNICIPALITY',
  ]),
});

export const WardSchema = z.object({
  CODE: z.string(),
  MUNICIPALITY_CODE: z.string(),
  NUMBER: z.number(),
});

export type Province = z.infer<typeof ProvinceSchema>;
export type District = z.infer<typeof DistrictSchema>;
export type Municipality = z.infer<typeof MunicipalitySchema>;
export type Ward = z.infer<typeof WardSchema>;

export interface LocationSearchParams {
  fields: string[];
  page?: number;
  limit?: number;
  search?: string;
  provinceCode?: string;
  districtCode?: string;
  municipalityCode?: string;
}
