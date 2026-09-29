// based on https://clerk.com/docs/fastify/getting-started/quickstart
import Fastify from 'fastify'
import { clerkPlugin, getAuth } from '@clerk/fastify'

const fastify = Fastify({ logger: true })

fastify.register(clerkPlugin)

// Use `getAuth()` to protect this route
fastify.get('/protected', async (request, reply) => {
  try {
    // Use `getAuth()` to access `isAuthenticated` and the machine ID & scopes
    const { isAuthenticated, subject, scopes } = getAuth(request, { acceptsToken: "m2m_token" })

    // If user isn't authenticated, return a 401 error
    if (!isAuthenticated) {
      return reply.code(401).send({ error: 'Machine not authenticated' })
    }

    return reply.send({
      message: 'Machine authenticated successfully',
      subject,
      scopes,
    })
  } catch (error) {
    fastify.log.error(error)
    return reply.code(500).send({ error: 'Failed to authenticate machine' })
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 8080 })
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()
