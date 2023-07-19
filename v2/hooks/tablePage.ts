import type { paginationType } from "@/interface"
import type { DataTableProps } from "naive-ui";
import type { Ref } from "vue";

type pageChangeType = {
  loadFlag: Ref<boolean>,
  localPagination: Ref<paginationType>,
  /**
   * 改变分页执行的回调
   */
  changFn: Function,
}
function useTablePage({loadFlag,localPagination,changFn}:pageChangeType) {
  const handlePageChange:DataTableProps['onUpdate:page'] = (val) =>  {
    if (loadFlag.value) return
    localPagination.value.pageNum = val;
    changFn()
  }
  const handleSizeChange:DataTableProps['onUpdate:pageSize'] = (val)=> {
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

  return {
    handlePageChange,handleSizeChange
  }
}
export default useTablePage