
export type paginationType = {
  pageNum: number,
  pageSize: number,
  total: number,
}
type resDataType<T> = { records: T } & paginationType

export type resType<T> = {
  status: number,
  data?: resDataType<T>,
}
export type requestFnType<T=myRowType> = (params: {
  pageNum: number,
  pageSize: number,
  sort: any[]
}) => Promise<resType<T>>
// 临时解决
export type myRowType = {
  [key: string]: string
}
