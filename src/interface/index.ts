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
    span?: number; // 搜索项所占用的列数，默认为1列
    offset?: number; // 搜索字段左侧偏移列数
    defaultValue?: string | number | boolean | any[]; // 搜索项默认值
  } & Partial<Record<BreakPoint, Responsive>>,
  [key: string]: any,
}

export type BreakPoint = "xs" | "sm" | "md" | "lg" | "xl";

export type Responsive = {
  span?: number;
  offset?: number;
};

export type SearchType =
  | "input"
  | "checkbox"
  | "date-picker"
  | "input-number"
  | "radio"
  | "select"
  | "switch"
  | "mention"
