import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { nanoid } from 'nanoid'
import { CreateShortUrlBodySchema, CreateShortUrlResponseSchema, RedirectParamsSchema, ErrorResponseSchema, CreateUrlStatsResponseSchema, StatsParamsSchema, GetAllUrlStatsResponseSchema } from '../schemas/shortener.schema.js'
import { request } from 'node:http'

export const shortenerRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  // 接口 1: 生成短链接
  fastify.post(
    '/shorten',
    {
      schema: {
        body: CreateShortUrlBodySchema,
        response: {
          201: CreateShortUrlResponseSchema,
          404: ErrorResponseSchema,
          409: ErrorResponseSchema
        }
      },
    },
    async (request, reply) => {
      const { url, customCode } = request.body
      
      if(customCode) {
        const existing = await fastify.prisma.shortUrl.findUnique({
          where: { code: customCode },
        })

        const RESERVED_CODES = ['ping', 'docs', 'shorten', 'stats']
        if (customCode && RESERVED_CODES.includes(customCode.toLowerCase())) {
          return reply.badRequest('该短码为系统保留字，请更换一个')
        }        

        if(existing) {
          return reply.conflict('该自定义短码已被占用, 请更换一个')
        }
      }

      const code = customCode ?? nanoid(6)

      try {
        await fastify.prisma.shortUrl.create({
          data: {
            code,
            longUrl: url, // 修改为数据库中定义的 longUrl 字段
          },
        })
      } catch (err: any) {
        if(err.code === 'P2002') {
          return reply.conflict('短码已被占用, 请重试')
        }
        throw err
      } 

      return reply.code(201).send({
        code,
        shortUrl: `http://localhost:3000/${code}`,
      })
    }
  )

  // 接口 2: 短链 302 重定向跳转
  fastify.get(
    '/:code',
    {
      schema: {
        params: RedirectParamsSchema,
        response: {
          404: ErrorResponseSchema
        },
      },
    },
    async (request, reply) => {
      const { code } = request.params

      const record = await fastify.prisma.shortUrl.findUnique({
        where: { code },
      })

      if (!record) {
        return reply.notFound('该短链接不存在或已失效')
      }

      fastify.prisma.shortUrl
        .update({
          where: { id: record.id },
          data: { clicks: { increment: 1 } },
        })
        .catch((err: unknown) => fastify.log.error(err))

      return reply.redirect(record.longUrl, 302)
    }
  )

  // 接口 3: 查询短链原始URL, 创建时间和累计点击次数
  fastify.get(
    '/stats/:code',
    {
      schema: {
        params: StatsParamsSchema,
        response: {
          200: CreateUrlStatsResponseSchema,
          404: ErrorResponseSchema
        },
      },
    },
    async( request, reply ) => {
      const { code } = request.params

      const record = await fastify.prisma.shortUrl.findUnique({
        where: { code },
      })

      if(!record) {
        return reply.notFound('该短链接不存在或已失效')
      }

      const { longUrl, clicks, createdAt } = record
      return reply.code(200).send({
        code, longUrl, clicks, createdAt
      })
    }
  )

  // 接口 4: 健康检测 ping
  fastify.get('/ping', async () => {
    return { message: 'pong' }
  })

  // 接口 5: 获取所有数据
  fastify.get(
    '/stats',
    {
      schema: {
        response: {
          200: GetAllUrlStatsResponseSchema,
          404: ErrorResponseSchema
        }
      }
    },
    async ( request, reply ) => {
      const recordList = await fastify.prisma.shortUrl.findMany()

      if(!recordList) {
        return reply.notFound('不存在任何短链')
      }

      return reply.code(200).send({ list: recordList })
    }
  )
}