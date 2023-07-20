<script setup lang='ts'>
defineOptions({ name: 'DxTable' })
import TableConfig from './TableConfig.vue'
import { NDataTable } from 'naive-ui'
import type { DataTableProps } from 'naive-ui'
import type { ColumnsProps, columnSetting, columnsSetting, requestFnType } from "@/interface/index";
import useTableRequest from '../hooks/tableRequest'
import useTablePage from '../hooks/tablePage'
import useTableConfig from '../hooks/tableConfig'
import useTableDrag from '../hooks/tableDrag'

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
}

const props = withDefaults(defineProps<tablePropType>(), {
  needStore: true,
  immediateRequest: true,
  needInfinite: false,
  isPagination: true,
  storeName: 'default'
})

const loadFlag = ref(true)
let tableData = ref<NonNullable<DataTableProps['data']>>([])


let localPagination = ref({ total: 0, pageSize: 30, pageNum: 1 })


const dataTable = ref<InstanceType<typeof NDataTable> | null>(null)

const { loadData } = useTableRequest({ loadFlag, localPagination, tableData: tableData, tableProps: props })

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

const { tableRowKey, localColums } = init()


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
    @update:sorter="handleSorterChange" @scroll="scroll" :on-update-drag-end="columDragEnd" />
</template>

<style scoped lang='scss'></style>