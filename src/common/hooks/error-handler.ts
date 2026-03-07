import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from '../errors/app-error'

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ error: error.message })
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Dados inválidos',
      details: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return reply.status(error.statusCode).send({ error: error.message })
  }

  request.log.error(error)
  return reply.status(500).send({ error: 'Erro interno do servidor' })
}
