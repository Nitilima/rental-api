import { z } from "zod";
import { PaginationSchema, PaginatedResponse } from "../../common/types/pagination";

export const DirectorParamsSchema = z.object({
    id: z.string().uuid({ message: 'ID inválido' }),
})

export const CreateDirectorSchema = z.object({
    name: z.string({ required_error: 'nome é obrigatório' }).min(1).max(255),
})

export const UpdateDirectorSchema = z.object({
    name: z.string().min(1).max(255),
})

export const ListDirectorQuerySchema = PaginationSchema.extend({
    name: z.string().optional(),
})

export const DirectorResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    movies: z.array(z.object({
        id: z.string(),
        title: z.string(),
        year: z.number().nullable(),
        genre: z.string().nullable(),
    })),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const PaginatedDirectorResponseSchema = z.object({
    data: z.array(DirectorResponseSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
})

export type CreateDirectorInput = z.infer<typeof CreateDirectorSchema>
export type UpdateDirectorInput = z.infer<typeof UpdateDirectorSchema>
export type ListDirectorQuery = z.infer<typeof ListDirectorQuerySchema>
export type DirectorResponse = z.infer<typeof DirectorResponseSchema>
export type PaginatedDirectorResponse = PaginatedResponse<DirectorResponse>
