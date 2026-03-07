import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import swaggerPlugin from './plugins/swagger'
import { errorHandler } from './common/hooks/error-handler'
import { moviesRoutes } from './modules/movies/moviesRoutes'
import { directorRoutes } from './modules/directors/directorRoutes'
import { customerRoutes } from './modules/customer/customerRoutes'
import { copyRoutes } from './modules/copy/copyRoutes'
import { rentalRoutes } from './modules/rental/rentalRoutes'
import authPlugin from './plugins/auth'

export async function buildApp() {
  const app = Fastify({
    logger: { level: process.env.LOG_LEVEL || 'info' },
  })

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(cors, { origin: process.env.WEB_URL || '*' })
  await app.register(helmet)
  await app.register(swaggerPlugin)
  await app.register(authPlugin)

  app.setErrorHandler(errorHandler)

  app.register(moviesRoutes, { prefix: '/api/movies' })
  app.register(directorRoutes, { prefix: '/api/director' })
  app.register(customerRoutes, { prefix: '/api/customer' })
  app.register(copyRoutes, { prefix: '/api/copy' })
  app.register(rentalRoutes, { prefix: '/api/rental' })

  return app
}
