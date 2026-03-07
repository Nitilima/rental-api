import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CustomerService } from './customerService'
import { CustomerParamsSchema, CustomerResponseSchema, CreateCustomerSchema, ListCustomerQuerySchema, PaginatedCustomerResponseSchema, UpdateCustomerSchema } from './customerSchema'

export async function customerRoutes(fastify: FastifyInstance) {
    const service = new CustomerService()
    const f = fastify.withTypeProvider<ZodTypeProvider>()

    f.get('/', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Usuários'],
            summary: 'Listar todos (paginado)',
            querystring: ListCustomerQuerySchema,
            response: { 200: PaginatedCustomerResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.findAll(request.query))
    })

    f.get('/me', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Usuários'],
            summary: 'Buscar cliente do usuário logado',
            response: { 200: CustomerResponseSchema },
        },
    }, async (request, reply) => {
        const keycloakId = (request.user as { sub: string }).sub
        return reply.send(await service.findByKeycloakId(keycloakId))
    })


    f.get('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Usuários'],
            summary: 'Buscar por ID',
            params: CustomerParamsSchema,
            response: { 200: CustomerResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.findById(request.params.id))
    })

    f.post('/', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Usuários'],
            summary: 'Criar',
            body: CreateCustomerSchema,
            response: { 201: CustomerResponseSchema },
        },
    }, async (request, reply) => {
        return reply.status(201).send(await service.create(request.body))
    })

    f.put('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Usuários'],
            summary: 'Atualizar',
            params: CustomerParamsSchema,
            body: UpdateCustomerSchema,
            response: { 200: CustomerResponseSchema },
        },
    }, async (request, reply) => {
        return reply.send(await service.update(request.params.id, request.body))
    })

    f.delete('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Usuários'],
            summary: 'Deletar',
            params: CustomerParamsSchema,
        },
    }, async (request, reply) => {
        await service.remove(request.params.id)
        return reply.status(204).send()
    })
}
