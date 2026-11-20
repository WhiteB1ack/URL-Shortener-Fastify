import { ref } from 'vue'
import type { CreateShortUrlResponse } from '../types/shortener'

const STORAGE_KEY = 'url_shortener_history'
const MAX_ITEMS = 20

function loadFromStorage(): CreateShortUrlResponse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CreateShortUrlResponse[]): []
  } catch {
    return []
  }
}

export function useHistory(){
  const historyList = ref<CreateShortUrlResponse[]>(loadFromStorage())

  const saveToStroage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historyList.value))
  }

  // 新增一条聊天记录(并重置于顶部)
  const addHistroy = (item: Omit<CreateShortUrlResponse, 'createdAt'>) => {
    const filtered = historyList.value.filter((h) => h.code !== item.code)
    historyList.value = [
      {...item, createdAt: new Date().toISOString()},
      ...filtered,
    ].slice(0, MAX_ITEMS)
    saveToStroage()
  }

  // 删除单条记录
  const removeHistory = (code: string) => {
    historyList.value = historyList.value.filter((h) => h.code !== code)
  }

  // 清除全部记录
  const clearHistory = () => {
    historyList.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    historyList,
    addHistroy,
    removeHistory,
    clearHistory
  }
}