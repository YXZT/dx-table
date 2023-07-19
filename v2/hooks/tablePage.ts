import type { ColumnsProps, paginationType, requestFnType } from "@/interface"
import type { DataTableProps } from "naive-ui";
import { computed, type Ref } from "vue";
interface tablePropType extends /* @vue-ignore */ Omit<DataTableProps, 'columns' | 'rowKey'> {
  columns: ColumnsProps,
  request?: requestFnType,
  data?: Array<any>,
  isPagination?: boolean,
  needInfinite?: boolean,
  rowKey?: string,
  immediateRequest?: boolean,
  needStore?: boolean,
  storeName?: string,
}
type pageChangeType = {
  tableProps: Readonly<tablePropType>,
  loadFlag: Ref<boolean>,
  localPagination: Ref<paginationType>,
  /**
   * 改变分页执行的回调
   */
  changFn: Function,
}
function useTablePage({ loadFlag, localPagination, changFn, tableProps }: pageChangeType) {
  const handlePageChange: DataTableProps['onUpdate:page'] = (val) => {
    if (loadFlag.value) return
    localPagination.value.pageNum = val;
    changFn()
  }
  const handleSizeChange: DataTableProps['onUpdate:pageSize'] = (val) => {
    if (loadFlag.value) return
    localPagination.value.pageSize = val;
    // 获取最大页数
    const pageMax = Math.ceil(localPagination.value.total / val);
    // 判断跳转页数是否大于最大页数，如果大于，跳转页数就等于最大页数
    if (localPagination.value.pageNum > pageMax) {
      localPagination.value.pageNum = pageMax;
    }
    changFn()
  }
  const pagination = computed(() => {
    if (tableProps.needInfinite) return undefined
    if (!tableProps.isPagination) return undefined
    return {
      page: localPagination.value.pageNum,
      pageSize: localPagination.value.pageSize,
      itemCount: localPagination.value.total,
      showSizePicker: true,
      pageSizes: [20, 30, 50, 100, 1000],
    }
  })
  return {
    handlePageChange, handleSizeChange, pagination
  }
}
export default useTablePage