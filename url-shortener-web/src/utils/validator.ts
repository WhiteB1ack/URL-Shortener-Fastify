const CODE_REGEX = /^[a-zA-Z0-9_-]{4,12}$/
const RESERVED_CODES = ['ping', 'docs', 'shorten', 'stats']

/*
 校验原始长连接是否合法
*/
export function validateLongUrl(rawUrl: string): { valid: boolean; message?: string } {
  const trimmed = rawUrl.trim()
  if(!trimmed) {
    return { valid: false, message: '请输入需要缩短的原链接' }
  }

  try {
    const parsed = new URL(trimmed)
    // 限制只允许 http 或 https 协议, 避免 javascript: 等非法协议
    if(parsed.protocol !== 'http:' && parsed.protocol != 'https:'){
      return { valid: false, message: '连接必须以 http:// 或 https:// 开头' }
    }
    return { valid: true }
  } catch {
    return { valid: false, message: '请输入合法的完整网址 (https://example/com)' }
  }
}

/*
 * 校验短码格式(用于自定义短码 和 查询短码)
*/
export function validateShortCode(rawCode: string): { valid: boolean; message?: string } {
  const trimmed = rawCode.trim()
  if(!CODE_REGEX.test(trimmed)){
    return { valid: false, message: '短码需为 4~12 位字母, 数字, 下划线或短横线' }
  }

  if(RESERVED_CODES.includes(trimmed.toLowerCase())){
    return { valid: false, message: '该短码为系统保留字, 请更换一个' }
  }
  
  return { valid: true }
}