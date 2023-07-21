import type { ColumnsProps, paginationType, requestFnType } from "@/interface"
import type { DataTableProps } from "naive-ui";
import type { RowData } from "naive-ui/es/data-table/src/interface";
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


type tableRowFocusType = {
  tableData: Ref<any[]>,
  tableProps: Readonly<tablePropType>
}
/**
 * 设置当前focus行
 */
export type setCurrentFocusRowType = (opt: {
  setKey?: number | undefined;
  index?: number | undefined;
}) => void

function useTableRow({ tableData, tableProps }: tableRowFocusType) {
  const currentFocusRow = ref<RowData>()
  const currentFocusRowKey = ref<number | null>()
  const currentFocusRowIndex = ref<number | null>(null)
  const rowKey = tableProps.rowKey || 'id'

  const setCurrentFocusRow: setCurrentFocusRowType = ({ setKey, index }) => {
    let rowIndex = -1
    if (index != null) {
      rowIndex = index
    } else {
      rowIndex = tableData.value.findIndex(ele => {
        return ele[rowKey] === setKey
      })
    }

    if (rowIndex > -1) {
      currentFocusRow.value = tableData.value[rowIndex]
      currentFocusRowKey.value = tableData.value[rowIndex][rowKey]
      currentFocusRowIndex.value = rowIndex
    } else {
      currentFocusRow.value = {}
      currentFocusRowKey.value = null
      currentFocusRowIndex.value = null
    }
  }
  /**
   * 给表格默认一个高亮
   */
  const setTableCurrent = () => {
    if (tableData.value.length === 0) {
      setCurrentFocusRow({ index: -1 })
    } else {
      let isInIndex = -1
      if (currentFocusRowKey.value) {
        isInIndex = tableData.value.findIndex(ele => ele[rowKey] === currentFocusRowKey.value)
      }
      isInIndex > -1 ? setCurrentFocusRow({ index: isInIndex }) : setCurrentFocusRow({ index: 0 })
    }
  }
  const toggleRow = (row: RowData) => {
    setCurrentFocusRow({ setKey: row[rowKey] })
  }
  const tableRowProps = (row: RowData, index: number) => {
    return {
      style: 'cursor: pointer;',
      // class: rowClass.value(row,index),
      onClick: () => toggleRow(row)
    }
  }
  const tableRowClass = (row: RowData) => {
    if (currentFocusRowKey.value && row[rowKey] === currentFocusRowKey.value) {
      return 'cur-focus-row'
    }
    return ''
  }
  return {
    currentFocusRow,
    currentFocusRowKey,
    currentFocusRowIndex,
    tableRowProps,
    setCurrentFocusRow,
    tableRowClass,
    setTableCurrent
  }
}
export default useTableRow