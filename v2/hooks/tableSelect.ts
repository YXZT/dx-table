import type { ColumnsProps, requestFnType, tableCheckType } from "@/interface";
import type { DataTableProps } from "naive-ui";
import type { RowData } from "naive-ui/es/data-table/src/interface";
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
  const rowKey = tableProps.rowKey||'id'
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

  tableProps.checkedRowKeys && watch(() => checkedRowKeys.value, (val) => {
    if (val === undefined) return
    const data = [...tableData.value]
    const newData = data.filter((dataRow: any) => val.includes(dataRow[rowKey]))
    updateCheckedRows.value(newData)
  })

  tableProps.checkedRowKeys && watch(tableProps.columns, (newVal) => {
    let type: tableCheckType = null
    const col = newVal.find(col => col.type === 'selection')
    if (col) {
      if ((col as any).multiple === false) {
        type = 'radio'
      } else {
        type = 'checkBox'
      }
    }
    tableCheck.value = type
  }, {
    immediate: true,
    deep: false,
  })

  const selectToggleRow = (row: RowData) => {
    console.log(row);
    
    if (!checkedRowKeys.value) return
    const isInIndex = checkedRowKeys.value.findIndex(key => key === row[rowKey])
    let _checkedRowKeys = [...checkedRowKeys.value]

    if (isInIndex > -1) {
      _checkedRowKeys.splice(isInIndex, 1)
    } else {
      if (tableCheck.value === 'checkBox') {
        _checkedRowKeys.push(row[rowKey])
      } else {
        _checkedRowKeys = [row[rowKey]]
      }
    }
    changeRowKeys(_checkedRowKeys)
  }

  return {
    updateCheckedRowKeys,
    updateCheckedRows,
    updateRowKeys,
    selectToggleRow
  };
}
export default useTableSelect
