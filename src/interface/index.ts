import type { DataTableColumn } from "naive-ui";


export type ColumnProps<T> = DataTableColumn<T> & {
  isShow?: Boolean,
  key: string | number,
}
export type columnSetting<T> = Omit<DataTableColumn<T>,'fixed'> & {
  isShow: Boolean,
  key: string | number,
  fixed : "left" | "right" | "none"
}

export type paginationType = {
  pageNum: number,
  pageSize: number,
  total: number,
}
type resDataType = {
  [records: string]: any,
} & paginationType

export type resType = {
  status: number,
  data?: resDataType,
}
export type requestFnType = (params: any) => Promise<resType>