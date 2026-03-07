import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { DirectorService } from './directorService'
import { DirectorParamsSchema, DirectorResponseSchema, CreateDirectorSchema, ListDirectorQuerySchema, PaginatedDirectorResponseSchema, UpdateDirectorSchema } from
    './directorSchema'

export async function directorRoutes(fastify: FastifyInstance) {
    const service = new DirectorService()
    const f = fastify.withTypeProvider<ZodTypeProvider>()

    f.get('/', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Diretores'],
            summary: 'Listar todos (paginado)',
            querystring: ListDirectorQuerySchema,
            response: { 200: PaginatedDirectorResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.findAll(request.query))
    })

    f.get('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Diretores'],
            summary: 'Buscar por ID',
            params: DirectorParamsSchema,
            response: { 200: DirectorResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.findById(request.params.id))
    })

    f.post('/', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Diretores'],
            summary: 'Criar',
            body: CreateDirectorSchema,
            response: { 201: DirectorResponseSchema },
        },
    }, async (request, reply) => {
        return reply.status(201).send(await service.create(request.body))
    })

    f.put('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Diretores'],
            summary: 'Atualizar',
            params: DirectorParamsSchema,
            body: UpdateDirectorSchema,
            response: { 200: DirectorResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.update(request.params.id, request.body))
    })

    f.delete('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Diretores'],
            summary: 'Deletar',
            params: DirectorParamsSchema,
        },
    }, async (request, reply) => {
        await service.remove(request.params.id)
        return reply.status(204).send()
    })
}
