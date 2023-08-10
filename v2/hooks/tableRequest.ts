import type { ColumnsProps,paginationType, requestFnType } from "@/interface"
import type { DataTableProps, NDataTable } from "naive-ui";
import { ref, type Ref } from "vue";
interface tablePropType extends /* @vue-ignore */ Omit<DataTableProps, 'columns' | 'rowKey'> {
  columns: ColumnsProps,
  request?: requestFnType,
  data?: Array<any>,
  isPagination?: boolean,
  needInfinite?: boolean,
  rowKey?: string,
  immediateRequest?: Boolean,
}


type requestType = {
  loadFlag: Ref<boolean>,
  localPagination: Ref<paginationType>,
  tableData: Ref<any[]>,
  tableProps: Readonly<tablePropType>,
  dataTable: Readonly<Ref<InstanceType<typeof NDataTable> | null>>,
}
function useTableRequest({ loadFlag, localPagination, tableData, tableProps,dataTable }: requestType) {
  const loadDataCb = ref(()=>{})
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
          dataTable?.value?.scrollTo(0,0)
        }
      }
      loadFlag.value = false
      loadDataCb.value()
    }).catch(() => {
      tableData.value = []
      localPagination.value = { total: 0, pageSize: 20, pageNum: 1 }
      loadFlag.value = false
    })
  }
  function loadDataDirect(data: NonNullable<DataTableProps['data']>) {
    tableData.value = data
    loadFlag.value = false
    loadDataCb.value()
  }
  function loadData(isAppend: boolean=false) {
    // 是否开始加载
    if (tableProps.request) {
      loadTbData(tableProps.request, isAppend)
    } else if (Array.isArray(tableProps.data)) {
      loadDataDirect(tableProps.data)
    }
  }
  return {
    loadData,
    loadDataCb
  }
}
export default useTableRequest