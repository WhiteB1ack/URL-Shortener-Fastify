import fp from 'fastify-plugin'
import { fastify, type FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

// 拓展 FastifyInstance 的 TypeScript 类型声明
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient()
  await prisma.$connect()

  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect()
  })
}

export default fp(prismaPlugin)