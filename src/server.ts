import 'dotenv/config'
import { buildApp } from './app'
import { prisma } from './lib/prisma'

const start = async () => {
  const app = await buildApp()
  const port = Number(process.env.PORT) || 3000
  const host = process.env.HOST || '0.0.0.0'

  try {
    await app.listen({ port, host })
    console.log(`\n  Servidor rodando em http://${host}:${port}`)
    console.log(`  Documentação:      http://${host}:${port}/docs\n`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }

  const shutdown = async () => {
    await app.close()
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

start()
