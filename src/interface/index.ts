import type { DataTableColumn } from "naive-ui";


export type ColumnProps<T> = DataTableColumn<T> & {
  isShow?: Boolean,
  key: string | number,
}
export type columnSetting<T> = Omit<DataTableColumn<T>, 'fixed'> & {
  isShow: Boolean,
  key: string | number,
  fixed: "left" | "right" | "none"
}

export type paginationType = {
  pageNum: number,
  pageSize: number,
  total: number,
}
// type resDataType<myRowType> = {
//   [records: string]: any,
// } & paginationType
type resDataType<myRowType> = {records:myRowType} & paginationType

export type resType<myRowType> = {
  status: number,
  data?: resDataType<myRowType>,
}
export type requestFnType<myRowType> = (params: any) => Promise<resType<myRowType>>

export type tableCheckType = null | 'checkBox' | 'radio'

export type classFnType = (row: myRowType) => Array<string> | undefined
// 临时解决
export type myRowType = {
  [key: string]: string
}
