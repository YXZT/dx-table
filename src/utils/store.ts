export function setStore(key: string, val: any) {
  const curtime = new Date().getTime();//获取当前时间
  localStorage.setItem(key, JSON.stringify({val:val,time:curtime}))
}
export function getStore(key: string) {
  const val = localStorage.getItem(key);//获取存储的元素
  const dataobj = val && JSON.parse(val);//解析出json对象
  return dataobj && dataobj.val
}
export function delStore(key: string) {
  return localStorage.removeItem(key)
}
export function clear() {
  return localStorage.clear()
}