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
  sortOrder: 'descend' | 'ascend' | false,
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

type SearchRenderScope = {
  searchParam: { [key: string]: any };
  placeholder: string;
  clearable: boolean;
  options: any[];
  data: any[];
};

export type searchFormType = {
  label: string,
  prop: string,
  render?: (scope: SearchRenderScope) => any; // 自定义搜索内容渲染（tsx语法）
  search?: {
    el?: SearchType; // 当前项搜索框的类型
    props?: any; // 搜索项参数，根据 element plus 官方文档来传递，该属性所有值会透传到组件
    order?: number; // 搜索项排序（从大到小）
    defaultValue?: string | number | boolean | any[]; // 搜索项默认值
    width?: string,
  },
  isShow?: Boolean,
  [key: string]: any,
}

export type searchFormSetting = {
  label: string,
  prop: string,
  render?: (scope: SearchRenderScope) => any; // 自定义搜索内容渲染（tsx语法）
  search?: {
    el?: SearchType; // 当前项搜索框的类型
    props?: any; // 搜索项参数，根据 element plus 官方文档来传递，该属性所有值会透传到组件
    order?: number; // 搜索项排序（从大到小）
    defaultValue?: string | number | boolean | any[]; // 搜索项默认值
    width?: string,
  },
  isShow: Boolean,
  [key: string]: any,
}


export type SearchType =
  | "input"
  | "checkbox"
  | "date-picker"
  | "input-number"
  | "radio"
  | "select"
  | "switch"
  | "mention"
