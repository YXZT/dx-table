import type { ColumnsProps, requestFnType, tableCheckType } from "@/interface";
import type { DataTableProps } from "naive-ui";
import { ref, watch, type Ref } from "vue";
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
  checkedRows?: Array<any>,
}
type tableSelectType = {
  tableData: Readonly<Ref<any[]>>,
  tableProps: Readonly<tablePropType>,
  checkedRowKeys: Ref<any[]>
}
function useTableSelect({tableData,tableProps,checkedRowKeys }: tableSelectType) {
  const updateCheckedRowKeys = ref<(rowKeys:any[])=>void>(()=>{})
  const updateCheckedRows = ref<(rowKeys:any[])=>void>(()=>{})
  const tableCheck = ref<tableCheckType>(null)

  const updateRowKeys: DataTableProps['onUpdate:checkedRowKeys'] = (_rowKeys, _rows, meta) => {
    if (meta.action === 'checkAll') {
      const data = [...tableData.value]
      const keys = data.map((dataRow: any) => dataRow[tableProps.rowKey||'id'])
      changeRowKeys(keys)
    } else if (meta.action === 'uncheckAll') {
      changeRowKeys([])
    }
  }

  const changeRowKeys = (rowKeys: any[]) => {
    updateCheckedRowKeys.value(rowKeys)
    checkedRowKeys.value = rowKeys
  }
  console.log(tableProps.checkedRowKeys);

  tableProps.checkedRowKeys && watch(() => checkedRowKeys.value, (val) => {
    if (val === undefined) return
    const data = [...tableData.value]
    const newData = data.filter((dataRow: any) => val.includes(dataRow[tableProps.rowKey||'id']))
    updateCheckedRows.value(newData)
  })

  return {
    updateCheckedRowKeys,
    updateCheckedRows,
    updateRowKeys
  };
}
export default useTableSelect
