/*
ShortCode   length: 4~12,   4~12位短链标识码
LongUrl     存在不限制长度
Clicks      >0   num
CreateAt    时间
*/

export interface CreateShortUrlBody {
  url: string,
  customCode?: string
}

export interface CreateShortUrlResponse {
  code: string,
  shortUrl: string
}

export interface CreateUrlStatsResponse {
  code: string,
  longUrl: string,
  clicks: number,
  createdAt: Date
}

export interface GetAllUrlStatsResponseSchema {
  list: Array<CreateUrlStatsResponse>
}