<script setup lang='ts'>
defineOptions({ name: 'DxTable' })
import TableConfig from './TableConfig.vue'
import { NDataTable } from 'naive-ui'
import type { DataTableProps } from 'naive-ui'
import type { ColumnsProps, columnSetting, columnsSetting, requestFnType } from "@/interface/index";
import useTableRequest from '../hooks/tableRequest'
import useTablePage from '../hooks/tablePage'
import useTableConfig from '../hooks/tableConfig'
import useTableRow from '../hooks/tableRow'
import useKeyboardControl from '../hooks/tableKeyboardControl'
import useTableSelect from '../hooks/tableSelect'

import { computed, ref, watch } from 'vue';
import type { TableColumn } from 'naive-ui/es/data-table/src/interface';
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

const { loadData, loadDataCb } = useTableRequest({ loadFlag, localPagination, tableData: tableData, tableProps: props })

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
  tableRowClass } = useTableRow({ tableProps: props, tableData })

loadDataCb.value = () => {
  setTableCurrent()
}

const checkedRowKeysRef = props.checkedRowKeys ? ref(props.checkedRowKeys) : ref([])

const checkedRowsRef = ref([])

const { updateCheckedRowKeys,
  updateCheckedRows,
  updateRowKeys } = useTableSelect({ tableData, tableProps: props, checkedRowKeys: checkedRowKeysRef })

  updateCheckedRowKeys.value = (rowKeys)=>{
    emits('update:checkedRowKeys', rowKeys)
  }

  updateCheckedRows.value = (rowKeys)=>{
    emits('update:checkedRows', rowKeys)
  }

const { tableRowKey, localColums } = init()

const {
  startListening,
  stopListening,
} = useKeyboardControl({ dataTable, tableData, setCurrentFocusRow, currentFocusRowIndex })

watch(loadFlag, (val) => {
  if (val) {
    stopListening()
  } else {
    startListening()
  }
}, {
  immediate: true
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
    @update:sorter="handleSorterChange" @scroll="scroll" :on-update-drag-end="columDragEnd" :row-props="tableRowProps"
    :row-class-name="tableRowClass" :checkedRowKeys="checkedRowKeysRef" @update-checked-row-keys="updateRowKeys" />
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