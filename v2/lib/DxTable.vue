<script setup lang='ts'>
defineOptions({ name: 'DxTable' })
import { NDataTable } from 'naive-ui'
import type { DataTableProps } from 'naive-ui'
import type { requestFnType } from "@/interface/index";
import useTableRequest from '../hooks/tableRequest'

import { computed, ref } from 'vue';
interface tablePropType extends /* @vue-ignore */ Omit<DataTableProps, 'columns'> {
  columns: DataTableProps['columns'],
  request?: requestFnType,
  data?: Array<any>,
  isPagination?: boolean,
  needInfinite?: boolean,
}

const props = defineProps<tablePropType>()

const loadFlag = ref(true)
let tableData = ref<NonNullable<DataTableProps['data']>>([])

const TableColumns = computed(() => {
  const arr = props.columns
  return arr
})
let localPagination = ref({ total: 0, pageSize: 30, pageNum: 1 })

const { loadData } = useTableRequest({ loadFlag: loadFlag, localPagination: localPagination, tableData: tableData, tableProps: props })
loadData()




</script>
<template>
  <n-data-table v-bind="$attrs" size="small" :single-line="false" :data="tableData" :columns="TableColumns"
    ref="dataTable" :loading="loadFlag" v-bind:style="{ 'overflow-x': 'hidden' }" virtual-scroll />
</template>

<style scoped lang='scss'></style>