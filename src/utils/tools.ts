/**过滤对象中的空白字段 */
export function filterEmpty(obj) {
  for (let key in obj) {
    const val = obj[key]
    if (!val && val !== 0) {
      delete obj[key]
    } else if (Array.isArray(val) && !val.length) {
      delete obj[key]
    }
  }
  return obj
}