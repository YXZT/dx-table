import { ref, watch,type Ref} from 'vue';
import { deepCopy } from "@/utils";
import type { ColumnProps, tableCheckType } from "@/interface";
import type { DataTableProps } from 'naive-ui'
import type { DataTableRowKey } from 'naive-ui'
type hookType = {
  checkedRowKeys: Ref<DataTableProps['checkedRowKeys']>,
  checkedRows: Ref<Array<any>>,
  tableData: any[],
  columns: ColumnProps<any>[],
  emits: any
}
// 处理表格的选择逻辑
export function useTableSelect(options: hookType) {
  const { checkedRowKeys, checkedRows, tableData, columns, emits } = options
  // const checkedRowKeys = ref(checkedRowKeysRef)
  // const checkedRows = ref(checkedRowsRef)
  const tableCheck = ref<tableCheckType>(null)
  const updateRowKeys: DataTableProps['onUpdate:checkedRowKeys'] = (rowKeys, rows, meta) => {
    if (meta.action === 'checkAll') {
      const data = deepCopy<typeof tableData>(tableData)
      const keys = data.map((dataRow: any) => dataRow.key)
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
  const tableRowProps = (row: ColumnProps<any>) => {
    return {
      style: 'cursor: pointer;',
      onClick: () => {
        if (!checkedRowKeys.value) return
        if (!checkedRows.value) return
        const isInIndex = checkedRowKeys.value.findIndex(key => key === row.key)
        let _checkedRowKeys = deepCopy<typeof checkedRowKeys.value>(checkedRowKeys.value)
        
        if (isInIndex > -1) {
          _checkedRowKeys.splice(isInIndex, 1)
        } else {
          if (tableCheck.value === 'checkBox') {
            _checkedRowKeys.push(row.key)
          } else {
            _checkedRowKeys = [row.key]
          }
        }
        changeRowKeys(_checkedRowKeys)
      }
    }
  }
  return {
    updateRowKeys,
    tableRowProps,
  };
}

