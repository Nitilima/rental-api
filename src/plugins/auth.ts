import fp from 'fastify-plugin'
import jwt, { TokenOrHeader } from '@fastify/jwt'
import { FastifyRequest } from 'fastify'
import jwksClient from 'jwks-rsa'

const client = jwksClient({
    jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`
})

export default fp(async (fastify) => {
    fastify.register(jwt, {
        decode: { complete: true },
        secret: async (request: FastifyRequest, token: TokenOrHeader) => {
            const kid = ('header' in token ? token.header.kid : token.kid) as string
            const key = await client.getSigningKey(kid)
            return key.getPublicKey()
        }
    })

    fastify.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.status(401).send({ message: 'Não autorizado' })
        }
    })
})
