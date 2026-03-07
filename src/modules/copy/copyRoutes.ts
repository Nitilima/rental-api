import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CopyService } from './copyService'
import { CopyParamsSchema, CopyResponseSchema, CreateCopySchema, ListCopyQuerySchema, PaginatedCopyResponseSchema, UpdateCopySchema } from './copySchema'

export async function copyRoutes(fastify: FastifyInstance) {
    const service = new CopyService()
    const f = fastify.withTypeProvider<ZodTypeProvider>()

    f.get('/', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Cópias'],
            summary: 'Listar todas (paginado)',
            querystring: ListCopyQuerySchema,
            response: { 200: PaginatedCopyResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.findAll(request.query))
    })

    f.get('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Cópias'],
            summary: 'Buscar por ID',
            params: CopyParamsSchema,
            response: { 200: CopyResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.findById(request.params.id))
    })

    f.post('/', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Cópias'],
            summary: 'Criar',
            body: CreateCopySchema,
            response: { 201: CopyResponseSchema },
        },
    }, async (request, reply) => {
        return reply.status(201).send(await service.create(request.body))
    })

    f.put('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Cópias'],
            summary: 'Atualizar',
            params: CopyParamsSchema,
            body: UpdateCopySchema,
            response: { 200: CopyResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.update(request.params.id, request.body))
    })

    f.delete('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Cópias'],
            summary: 'Deletar',
            params: CopyParamsSchema,
        },
    }, async (request, reply) => {
        await service.remove(request.params.id)
        return reply.status(204).send()
    })
}
