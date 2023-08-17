<script setup lang='ts'>
defineOptions({ name: 'DxTable' })
import TableConfig from './TableConfig.vue'
import { NDataTable, NDropdown } from 'naive-ui'
import type { DataTableProps } from 'naive-ui'
import type { ColumnsProps, columnSetting, columnsSetting, requestFnType } from "@/interface/index";
import useTableRequest from '../hooks/tableRequest'
import useTablePage from '../hooks/tablePage'
import useTableConfig from '../hooks/tableConfig'
import useTableRow from '../hooks/tableRow'
import useKeyboardControl from '../hooks/tableKeyboardControl'
import useTableSelect from '../hooks/tableSelect'
import { useDropDown } from '@/hooks/tableDropdown'

import { inject, provide, ref, watch } from 'vue';
import type { RowData } from 'naive-ui/es/data-table/src/interface';
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
  checkedRowKeys?: DataTableProps['checkedRowKeys'],
  checkedRows?: Array<any>,
}

const props = withDefaults(defineProps<tablePropType>(), {
  rowKey: 'id',
  needStore: true,
  immediateRequest: true,
  needInfinite: false,
  isPagination: true,
  storeName: 'default'
})
const emits = defineEmits(['refreshed', 'update:checkedRowKeys', 'update:checkedRows'])

const loadFlag = ref(true)
let tableData = ref<NonNullable<DataTableProps['data']>>([])


let localPagination = ref({ total: 0, pageSize: 30, pageNum: 1 })


const dataTable = ref<InstanceType<typeof NDataTable> | null>(null)

const { loadData, loadDataCb } = useTableRequest({ loadFlag, localPagination, tableData: tableData, tableProps: props, dataTable })

function refresh(reset?: boolean) {
  if (reset) {
    localPagination.value = { total: 0, pageSize: localPagination.value.pageSize, pageNum: 1 }
  }
  loadData();
}

watch([() => props.data, () => props.request], () => {
  refresh(true)
})

const { handlePageChange, handleSizeChange, pagination, scroll } = useTablePage({ loadFlag, localPagination, tableProps: props, changFn: loadData })

const { init, TableColumns, localSearchSort, changeCol, changeSequence, changeSortOrder, resetConf, handleSorterChange, columDragEnd } = useTableConfig({ tableProps: props, loadDataFn: loadData })


const { currentFocusRow,
  currentFocusRowKey,
  currentFocusRowIndex,
  tableRowProps,
  setCurrentFocusRow,
  setTableCurrent,
  tableRowClass,
  clickRowFn } = useTableRow({ tableProps: props, tableData })

const checkedRowKeysRef = props.checkedRowKeys ? ref(props.checkedRowKeys) : ref([])

const checkedRowsRef = ref([])

const { updateCheckedRowKeys, updateCheckedRows, updateRowKeys, selectToggleRow, tableCheck } = useTableSelect({ tableData, tableProps: props, checkedRowKeys: checkedRowKeysRef })

clickRowFn.value = selectToggleRow

loadDataCb.value = () => {
  setTableCurrent()
  if (tableCheck.value === 'radio') {
    currentFocusRow.value && selectToggleRow(currentFocusRow.value)
  }
}

updateCheckedRowKeys.value = (rowKeys) => {
  emits('update:checkedRowKeys', rowKeys)
}

updateCheckedRows.value = (rowKeys) => {
  emits('update:checkedRows', rowKeys)
}


const { tableRowKey, localColums, tableConfig, setTableConfig } = init()

// 注入
provide('tableConfig', tableConfig)
provide('setTableConfig', setTableConfig)

let { renderDropDown, handleContextMenu, setOptions } = useDropDown()

setOptions.value = ({ curSelection, row, index }) => {
  return [
    {
      label: '复制',
      key: 'copy',
      disabled: !curSelection,
      fn: () => {
        navigator.clipboard.writeText(curSelection);
      }
    },
    {
      label: '搜索(仅当前)',
      key: 'search',
      fn: () => {
        console.log(row, index);
      }
    },
    {
      label: '刷新',
      key: 'refresh',
      fn: () => refresh(true)
    },
    {
      label: '导出到excel(仅当前)',
      key: 'exportCurent',
      fn: () => {
      }
    },
    {
      label: '导出到excel(所有)',
      key: 'exportAll',
      fn: () => {
      }
    }
  ]
}

const localTableRowProps = (row: RowData, index: number) => {
  const higherOrder = (row: RowData, index: number) => {
    return function (e: any) {
      handleContextMenu(e, row, index)
    }
  }
  return {
    ...tableRowProps(row, index),
    onContextmenu: higherOrder(row, index)
  }
}

const {
  startListening,
  stopListening,
} = useKeyboardControl({ dataTable, tableData, setCurrentFocusRow, currentFocusRowIndex, selectToggleRow, tableCheck })

watch(loadFlag, (val) => {
  if (val) {
    stopListening()
  } else {
    startListening()
  }
}, {
  immediate: true
})
defineExpose({
  refresh
})
</script>
<template>
  <TableConfig :tableRef="dataTable" :dataSetting="localColums" :sortData="localSearchSort" @change-show="changeCol"
    @change-sequence="changeSequence" @change-sort-order="changeSortOrder" @reset-conf="resetConf"
    @change-fixed="changeCol">
    <slot name="title">123
      <!-- <div v-show="checkedRowKeysRef?.length">已经选择：{{ checkedRowKeysRef?.length }} 条</div> -->
    </slot>
  </TableConfig>
  <n-data-table v-bind="$attrs" size="small" :single-line="false" :data="tableData" :columns="TableColumns"
    ref="dataTable" :loading="loadFlag" v-bind:style="{ 'overflow-x': 'hidden' }" virtual-scroll :pagination="pagination"
    remote @update:page-size="handleSizeChange" @update:page="handlePageChange" :row-key="tableRowKey"
    @update:sorter="handleSorterChange" @scroll="scroll" :on-update-drag-end="columDragEnd"
    :row-props="localTableRowProps" :row-class-name="tableRowClass" :checkedRowKeys="checkedRowKeysRef"
    @update-checked-row-keys="updateRowKeys" />
  <renderDropDown></renderDropDown>
</template>

<style scoped lang='scss'>
:deep(.cur-focus-row .n-data-table-td) {
  background-color: #cfe8fb !important;
}

:deep(.n-data-table-tr:not(.n-data-table-tr--summary):hover) {
  box-shadow: 0 0 10px 0px #aaa;
  position: relative;
}
</style>