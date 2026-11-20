import { Type, type Static } from '@sinclair/typebox'

// 1. 基础字段复用
const ShortCodeSchema = Type.String({
  minLength: 4,
  maxLength: 12,
  pattern: '^[a-zA-Z0-9_-]+$',
  description: '4~12位短链标识码',  
})

const LongUrlSchema = Type.String({
  description: '不限制长度'
})

const ClicksSchema = Type.Number({
  minimum: 0
})

const CreateAtSchema = Type.Transform(Type.String({ format: 'date-time' }))
  .Decode( value => new Date(value) )
  .Encode( value => value.toISOString());

// 2. 创建短链(POST /shorten)
export const CreateShortUrlBodySchema = Type.Object({
  url: Type.String({
    format: 'uri',
    description: '需要缩短的原始完整网页',
  }),
  customCode: Type.Optional(ShortCodeSchema)
})

export const CreateShortUrlResponseSchema = Type.Object({
  code: ShortCodeSchema,
  shortUrl: Type.String({ format: 'uri' }),
})

// 3. 短链跳转参数( GET /:code )
export const RedirectParamsSchema = Type.Object({
  code: ShortCodeSchema,
})

// 获取code链接(GET /stats/:code)
export const StatsParamsSchema = Type.Object({
  code: ShortCodeSchema
})

// 5. 响应体body 获取信息
export const CreateUrlStatsResponseSchema = Type.Object({
  code: ShortCodeSchema,
  longUrl: LongUrlSchema,
  clicks: ClicksSchema,
  createdAt: CreateAtSchema
})

// 4. 通用错误响应(配合 @fastify/sensible 的 404/400 等响应序列化)
export const ErrorResponseSchema = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
})

// 5. 自动推导出 TypeScript 静态类型(供Service 或其他模块使用)
export type CreateShortUrlBody = Static<typeof CreateShortUrlBodySchema>
export type CreateShortUrlResponse = Static<typeof CreateShortUrlResponseSchema>
export type RedirectParams = Static<typeof RedirectParamsSchema>
export type StatsParams = Static<typeof StatsParamsSchema>
export type CreateUrlStatsResponse = Static<typeof CreateUrlStatsResponseSchema>