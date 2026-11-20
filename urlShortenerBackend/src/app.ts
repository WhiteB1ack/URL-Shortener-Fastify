import Fastify from 'fastify'
import sensible from '@fastify/sensible'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import prismaPlugin from './plugins/prisma.js'
import { shortenerRoutes } from './routes/shortener.js'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import cors from '@fastify/cors'

export function buildApp() {
  const app = Fastify({
    logger: true,           // 开启内置高性能 Pino 日志
  }).withTypeProvider<TypeBoxTypeProvider>()

  // 注册插件
  app.register(cors, {
    origin: true
  })
  app.register(sensible)
  app.register(prismaPlugin)
  app.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'Shortener API',
        description: 'URL 短链接服务',
        version: '1.0.0',
      },
      servers: [
        { url: 'http://localhost:3000', description: '本地开发' },
      ],
    },
    // mode: 'dynamic' 是默认值，会自动从 TypeBox schema 生成文档
  })
  
  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })

  // 注册路由
  app.register(shortenerRoutes)

  return app
}
