import type { DataTableColumn } from "naive-ui";


export type ColumnProps = DataTableColumn<any> & {
  isShow?: Boolean,
  key: string | number,
}
export type columnSetting = Omit<DataTableColumn<any>,'fixed'> & {
  isShow: Boolean,
  key: string | number,
  fixed : "left" | "right" | "none"
}
// export type columnSetting = Omit<ColumnProps,'isShow'>  & {
//   isShow: Boolean,
// }

export type paginationType = {
  pageNum: number,
  pageSize: number,
  total: number,
}
export type resType = {
  status: number,
  data?: resDataType,
}
type resDataType = {
  [records: string]: any,
} & paginationType