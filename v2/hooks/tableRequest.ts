import type { paginationType, requestFnType } from "@/interface"
import type { DataTableProps } from "naive-ui";
import type { Ref } from "vue";

interface tablePropType extends /* @vue-ignore */ Omit<DataTableProps, 'columns'> {
  columns: DataTableProps['columns'],
  request?: requestFnType,
  data?: Array<any>,
  isPagination?: boolean,
  needInfinite?: boolean,
}


type requestType = {
  loadFlag: Ref<boolean>,
  localPagination: Ref<paginationType>,
  tableData: Ref<any[]>,
  tableProps: Readonly<tablePropType>
}
function useTableRequest({ loadFlag, localPagination, tableData, tableProps }: requestType) {
  function loadTbData(request: requestFnType, isAppend: boolean) {

    loadFlag.value = true
    const parameter = {
      pageNum: localPagination.value.pageNum,
      pageSize: localPagination.value.pageSize,
      sort: []
    }
    const result = request(parameter)
    result.then(res => {
      if (tableProps.isPagination || tableProps.needInfinite) {
        localPagination.value =
          Object.assign({}, localPagination.value, {
            pageNum: res?.data?.pageNum, // 返回结果中的当前分页数
            pageSize: res?.data?.pageSize,
            total: res?.data?.total || 0 // 返回结果中的总记录数
          })
      }
      const records = res.data?.records
      if (Array.isArray(records) && records.length) {
        if (isAppend) {
          tableData.value.push(...records)
        } else {
          tableData.value = records
        }
      }
      loadFlag.value = false
    }).catch(() => {
      tableData.value = []
      localPagination.value = { total: 0, pageSize: 20, pageNum: 1 }
      loadFlag.value = false
    })
  }
  function loadDataDirect(data: NonNullable<DataTableProps['data']>) {
    tableData.value = data
    loadFlag.value = false
  }
  function loadData() {
    // 是否开始加载
    if (tableProps.request) {
      loadTbData(tableProps.request, false)
    } else if (Array.isArray(tableProps.data)) {
      loadDataDirect(tableProps.data)
    }
  }
  return {
    loadData
  }
}
export default useTableRequest