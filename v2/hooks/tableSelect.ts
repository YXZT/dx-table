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
export type selectToggleRowType = (row: RowData) => void

function useTableSelect({ tableData, tableProps, checkedRowKeys }: tableSelectType) {
  const updateCheckedRowKeys = ref<(rowKeys: any[]) => void>(() => { })
  const updateCheckedRows = ref<(rowKeys: any[]) => void>(() => { })
  /**
   * 这个表格要的是多选还是单选
   */
  const tableCheck = ref<tableCheckType>('none')
  const rowKey = tableProps.rowKey || '_X_ROW_KEY'

  const updateRowKeys: DataTableProps['onUpdate:checkedRowKeys'] = (_rowKeys, _rows, meta) => {
    if (meta.action === 'checkAll') {
      const data = [...tableData.value]
      const keys = data.map((dataRow: any) => dataRow[tableProps.rowKey || '_X_ROW_KEY'])
      changeRowKeys(keys)
    } else if (meta.action === 'uncheckAll') {
      changeRowKeys([])
    }
  }

  const changeRowKeys = (rowKeys: any[]) => {
    updateCheckedRowKeys.value(rowKeys)
    checkedRowKeys.value = rowKeys
  }

  /**
   * 清除table中没有的rowKey
   * @param clearAll { boolean } 是否清除所有
   * @returns void
   */
  const clearRowKeys = (clearAll?:false) => {
    if (clearAll) {
      changeRowKeys([])
      return
    }
    const newRowKeys: any[] = []
    checkedRowKeys.value.filter((key) => {
      const isInIndex = tableData.value.findIndex(row => row[rowKey] === key)
      if (isInIndex > -1) {
        newRowKeys.push(key)
      }
    })
    changeRowKeys(newRowKeys)
  }

  tableProps.checkedRowKeys && watch(() => checkedRowKeys.value, (val) => {
    if (val === undefined) return
    const data = [...tableData.value]
    const newData = data.filter((dataRow: any) => val.includes(dataRow[rowKey]))
    updateCheckedRows.value(newData)
  })

  watch(tableProps.columns, (newVal) => {
    let type: tableCheckType = 'radio'
    const col = newVal.find(col => col.type === 'selection')
    if (col) {
      if ((col as any).multiple === false) {
        type = 'radio'
      } else {
        type = 'checkBox'
      }
    }else{
      type = 'none'
    }
    tableCheck.value = type
  }, {
    immediate: true,
    deep: false,
  })

  const selectToggleRow: selectToggleRowType = (row) => {
    if (!checkedRowKeys.value) return
    const isInIndex = checkedRowKeys.value.findIndex(key => key === row[rowKey])
    let _checkedRowKeys = [...checkedRowKeys.value]

    if (isInIndex > -1) {
      // 如果是单选，那还是保持这样
      if(tableCheck.value==='radio'){
        return
      }else if(tableCheck.value==='checkBox'){
        _checkedRowKeys.splice(isInIndex, 1)
      }
    } else {
      if (tableCheck.value === 'checkBox') {
        _checkedRowKeys.push(row[rowKey])
      } else if (tableCheck.value === 'radio'){
        _checkedRowKeys = [row[rowKey]]
      }
    }
    changeRowKeys(_checkedRowKeys)
  }

  return {
    updateCheckedRowKeys,
    updateCheckedRows,
    updateRowKeys,
    selectToggleRow,
    tableCheck,
    clearRowKeys
  };
}
export default useTableSelect
