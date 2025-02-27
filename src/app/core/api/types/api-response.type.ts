import { z } from 'zod';

export const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  size: z.number(),
  hasMore: z.boolean(),
  hasPrevious: z.boolean(),
  totalPages: z.number(),
  numberOfElements: z.number(),
  isFirst: z.boolean(),
  isLast: z.boolean(),
  isEmpty: z.boolean(),
});

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: dataSchema,
    meta: PaginationMetaSchema.optional(),
    timestamp: z.string(),
  });

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
};
