import type { TableColumn } from "naive-ui/es/data-table/src/interface"

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

export type ColumnProps = Omit<NonNullable<TableColumn>,'sorter'|'sortOrder'|'fixed'>  & {
  isShow?: boolean,
  key: string | number,
  fixed?: "left" | "right" | "none",
  order?: number,
  sorter: boolean | Function | 'default',
  sortOrder: 'descend' | 'ascend' | false
}
export type ColumnsProps = Array<ColumnProps>
export type columnSetting = Omit<NonNullable<TableColumn>,'sorter'|'sortOrder'|'fixed'> & {
  isShow: boolean,
  key: string | number,
  fixed: "left" | "right" | "none",
  order: number,
  sorter: boolean | Function | 'default',
  sortOrder: 'descend' | 'ascend' | false
  titleAlign: 'left' | 'right' | 'center'
}
export type columnsSetting = Array<columnSetting>

export type tableCheckType = 'checkBox' | 'radio'
