import { ref, watch, type Ref } from 'vue';
import { deepCopy } from "@/utils";
import type { ColumnProps, tableCheckType, classFnType,myRowType } from "@/interface";
import type { DataTableProps } from 'naive-ui'
import type { DataTableRowKey } from 'naive-ui'
type hookType = {
  checkedRowKeys: Ref<DataTableProps['checkedRowKeys']>,
  checkedRows: Ref<Array<any>>,
  tableData: any[],
  columns: ColumnProps<any>[],
  emits: any,
  rowKey: string,
}
// 处理表格的选择逻辑
export function useTableSelect(options: hookType) {
  const { checkedRowKeys, checkedRows, tableData, columns, emits ,rowKey} = options
  // const checkedRowKeys = ref(checkedRowKeysRef)
  // const checkedRows = ref(checkedRowsRef)
  const tableCheck = ref<tableCheckType>(null)
  const updateRowKeys: DataTableProps['onUpdate:checkedRowKeys'] = (_rowKeys, _rows, meta) => {
    if (meta.action === 'checkAll') {
      const data = deepCopy<typeof tableData>(tableData)
      const keys = data.map((dataRow: any) => dataRow[rowKey])
      changeRowKeys(keys)
    } else if (meta.action === 'uncheckAll') {
      changeRowKeys([])
    }
  }
  const changeRowKeys = (rowKeys: DataTableRowKey[]) => {
    emits('update:checkedRowKeys', rowKeys)
    // emits('update:checkedRows', checkedRows)
    checkedRowKeys.value = rowKeys
    // checkedRows.value = rows
  }
  watch(columns, (newVal) => {
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
  const rowClass = ref<classFnType>(() => [])

  const toggleRow = (row: myRowType) => {
    if (!checkedRowKeys.value) return
    if (!checkedRows.value) return
    const isInIndex = checkedRowKeys.value.findIndex(key => key === row[rowKey])
    let _checkedRowKeys = deepCopy<typeof checkedRowKeys.value>(checkedRowKeys.value)

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
  const tableRowProps = (row: myRowType,index:number) => {
    return {
      style: 'cursor: pointer;',
      class: rowClass.value(row,index),
      onClick: ()=>toggleRow(row)
    }
  }
  return {
    updateRowKeys,
    tableRowProps,
    toggleRow,
    rowClass
  };
}

