import { z } from 'zod'
import { PaginationSchema, PaginatedResponse } from '../../common/types/pagination'

export const CopyParamsSchema = z.object({
    id: z.string().uuid({ message: 'ID inválido' }),
})

export const CreateCopySchema = z.object({
    movieId: z.string().uuid({ message: 'Movie ID inválido' }),
})

export const UpdateCopySchema = z.object({
    movieId: z.string().uuid({ message: 'Movie ID inválido' }).optional(),
})

export const ListCopyQuerySchema = PaginationSchema.extend({
    movieId: z.string().uuid().optional(),
})

export const CopyResponseSchema = z.object({
    id: z.string(),
    movie: z.object({
        id: z.string(),
        title: z.string(),
        year: z.number().nullable(),
        genre: z.string().nullable(),
        poster: z.string().nullable(),
    }),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const PaginatedCopyResponseSchema = z.object({
    data: z.array(CopyResponseSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
})

export type CreateCopyInput = z.infer<typeof CreateCopySchema>
export type UpdateCopyInput = z.infer<typeof UpdateCopySchema>
export type ListCopyQuery = z.infer<typeof ListCopyQuerySchema>
export type CopyResponse = z.infer<typeof CopyResponseSchema>
export type PaginatedCopyResponse = PaginatedResponse<CopyResponse>
