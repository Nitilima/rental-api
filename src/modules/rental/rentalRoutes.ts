import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { RentalService } from './rentalService'
import { RentalParamsSchema, RentalResponseSchema, CreateRentalSchema, ListRentalQuerySchema, PaginatedRentalResponseSchema } from './rentalSchema'
import { z } from 'zod'

export async function rentalRoutes(fastify: FastifyInstance) {
    const service = new RentalService()
    const f = fastify.withTypeProvider<ZodTypeProvider>()

    f.get('/', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Aluguéis'],
            summary: 'Listar todos (paginado)',
            querystring: ListRentalQuerySchema,
            response: { 200: PaginatedRentalResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.findAll(request.query))
    })

    f.get('/overdue', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Aluguéis'],
            summary: 'Listar atrasados (e atualizar status)',
            response: { 200: z.array(RentalResponseSchema) },
        },
    }, async (request, reply) => {
        return reply.send(await service.findOverdue())
    })

    f.get('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Aluguéis'],
            summary: 'Buscar por ID',
            params: RentalParamsSchema,
            response: { 200: RentalResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.findById(request.params.id))
    })

    f.post('/', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Aluguéis'],
            summary: 'Criar aluguel',
            body: CreateRentalSchema,
            response: { 201: RentalResponseSchema },
        },
    }, async (request, reply) => {
        return reply.status(201).send(await service.create(request.body))
    })

    // endpoint especial para devolução
    f.patch('/:id/return', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Aluguéis'],
            summary: 'Devolver filme',
            params: RentalParamsSchema,
            response: { 200: RentalResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.return(request.params.id))
    })
}

