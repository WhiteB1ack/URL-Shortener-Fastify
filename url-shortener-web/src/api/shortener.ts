import request from "./request";
import type { CreateShortUrlBody, CreateShortUrlResponse, CreateUrlStatsResponse } from "../types/shortener";

// 接口1: /shorten post
export const createShortUrl = ( data: CreateShortUrlBody ) => {
  return request.post<CreateShortUrlResponse>('/shorten', data)
}

// 接口2: /{code}
export const redirectShortUrl = ( code: string ) => {
  return request.get(`/${code}`)
}

// 接口3: /stats/{code}
export const getShortUrl = ( code: string ) => {
  return request.get<CreateUrlStatsResponse>(`/stats/${code}`)
}

// 接口4: /ping
export const getPing = () => {
  return request.get<string>('/ping')
}