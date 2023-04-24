import { ref, watch } from 'vue';
import { deepCopy } from "@/utils";
import type { ColumnProps, tableCheckType } from "@/interface";
import type { DataTableProps } from 'naive-ui'
import type { DataTableRowKey } from 'naive-ui'
type hookType = {
  checkedRowKeys: DataTableProps['checkedRowKeys'],
  checkedRows: Array<any>,
  loadFlag: boolean,
  tableData: any[],
  columns: ColumnProps<any>[],
  emits: any
}
// 处理表格的选择逻辑
export function useTableSelect(options: hookType) {
  const { checkedRowKeys: checkedRowKeysRef, checkedRows, loadFlag, tableData, columns, emits } = options
  const checkedRowKeys = ref(checkedRowKeysRef)
  const tableCheck = ref<tableCheckType>(null)
  const updateRowKeys: DataTableProps['onUpdate:checkedRowKeys'] = (rowKeys, rows, meta) => {
    if (loadFlag) return
    if (meta.action === 'checkAll') {
      const data = deepCopy<typeof tableData>(tableData)
      const keys = data.map((dataRow: any) => dataRow.key)
      changeRowKeys(keys, data)
    } else if (meta.action === 'uncheckAll') {
      changeRowKeys([], [])
    }
  }
  const changeRowKeys = (rowKeys: DataTableRowKey[], checkedRows: any[]) => {
    emits('update:checkedRowKeys', rowKeys)
    emits('update:checkedRows', checkedRows)
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
  const tableRowProps = (row: ColumnProps<any>) => {
    return {
      style: 'cursor: pointer;',
      onClick: () => {
        if (!checkedRowKeys.value) return
        if (!checkedRows) return
        if (loadFlag) return
        const isInIndex = checkedRowKeys.value.findIndex(key => key === row.key)
        let _checkedRowKeys = deepCopy<typeof checkedRowKeys.value>(checkedRowKeys.value)
        let _checkedRows = deepCopy<typeof checkedRows>(checkedRows)
        if (isInIndex > -1) {
          _checkedRowKeys.splice(isInIndex, 1)
          _checkedRows.splice(isInIndex, 1)
        } else {
          if (tableCheck.value === 'checkBox') {
            _checkedRowKeys.push(row.key)
            _checkedRows.push(row)
          } else {
            _checkedRowKeys = [row.key]
            _checkedRows = [row]
          }
        }
        changeRowKeys(_checkedRowKeys, _checkedRows)
      }
    }
  }
  return {
    updateRowKeys,
    tableRowProps,
  };
}

