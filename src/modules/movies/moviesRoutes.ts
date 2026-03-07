import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { Genre } from '@prisma/client'
import { MoviesService } from './moviesService'
import { MoviesParamsSchema, MoviesResponseSchema, CreateMoviesSchema, GenreSchema, ListMoviesQuerySchema, PaginatedMoviesResponseSchema, UpdateMoviesSchema } from './moviesSchema'

export async function moviesRoutes(fastify: FastifyInstance) {
    const service = new MoviesService()
    const f = fastify.withTypeProvider<ZodTypeProvider>()

    f.get('/genres', {
        schema: {
            tags: ['Filmes'],
            summary: 'Listar gêneros disponíveis',
            response: { 200: z.array(GenreSchema) },
        },
    }, async (request, reply) => {
        return reply.send(Object.values(Genre))
    })

    f.get('/', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Filmes'],
            summary: 'Listar todos (paginado)',
            querystring: ListMoviesQuerySchema,
            response: { 200: PaginatedMoviesResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.findAll(request.query))
    })

    f.get('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Filmes'],
            summary: 'Buscar por ID',
            params: MoviesParamsSchema,
            response: { 200: MoviesResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.findById(request.params.id))
    })

    f.post('/', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Filmes'],
            summary: 'Criar',
            body: CreateMoviesSchema,
            response: { 201: MoviesResponseSchema },
        },
    }, async (request, reply) => {
        return reply.status(201).send(await service.create(request.body))
    })

    f.put('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Filmes'],
            summary: 'Atualizar',
            params: MoviesParamsSchema,
            body: UpdateMoviesSchema,
            response: { 200: MoviesResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.update(request.params.id, request.body))
    })

    f.delete('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Filmes'],
            summary: 'Deletar',
            params: MoviesParamsSchema,
        },
    }, async (request, reply) => {
        await service.remove(request.params.id)
        return reply.status(204).send()
    })
}
