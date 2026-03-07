import { z } from "zod";
import { Genre } from "@prisma/client";
import { PaginationSchema, PaginatedResponse } from "../../common/types/pagination";

export const GenreSchema = z.enum(Object.values(Genre) as [Genre, ...Genre[]])

export const MoviesParamsSchema = z.object({
    id: z.string().uuid({ message: 'ID inválido' })
})

// create
export const CreateMoviesSchema = z.object({
    title: z.string({ required_error: 'título é obrigatório' }).min(1).max(255),
    synopsis: z.string().max(2000).optional(),
    poster: z.string().url({ message: 'URL do poster inválida' }).optional(),
    year: z.number().int().min(1888).max(2100).optional(),
    duration: z.number().int().positive().optional(),
    rating: z.number().min(0).max(10).optional(),
    genre: GenreSchema.optional(),
    directorId: z.string().uuid({ message: 'Director ID inválido' }).optional(),
})

// update
export const UpdateMoviesSchema = CreateMoviesSchema.partial()

// filter
export const ListMoviesQuerySchema = PaginationSchema.extend({
    name: z.string().optional(),
    genre: GenreSchema.optional(),
    year: z.coerce.number().int().optional(),
})

// get - response
export const MoviesResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    synopsis: z.string().nullable(),
    poster: z.string().nullable(),
    year: z.number().nullable(),
    duration: z.number().nullable(),
    rating: z.number().nullable(),
    genre: GenreSchema.nullable(),
    director: z.object({
        id: z.string(),
        name: z.string(),
    }).nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})


// paginado
export const PaginatedMoviesResponseSchema = z.object({
    data: z.array(MoviesResponseSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
})


export type CreateMoviesInput = z.infer<typeof CreateMoviesSchema>
export type UpdateMoviesInput = z.infer<typeof UpdateMoviesSchema>
export type ListMoviesQuery = z.infer<typeof ListMoviesQuerySchema>
export type MoviesResponse = z.infer<typeof MoviesResponseSchema>
export type PaginatedBookResponse = PaginatedResponse<MoviesResponse>