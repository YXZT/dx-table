<script setup lang='ts'>
defineOptions({ name: 'DxTable' })
import { NDataTable } from 'naive-ui'
import type { DataTableProps } from 'naive-ui'
import type { requestFnType } from "@/interface/index";

import { ref } from 'vue';
interface tablePropType extends /* @vue-ignore */ Omit<DataTableProps, 'columns'> {
  columns: DataTableProps['columns'],
  request?: requestFnType
}

const props = defineProps<tablePropType>()
const loadFlag = ref(true)
loadData()

let tableData = ref<DataTableProps['data']>([])
function loadData() {
  // 是否开始加载
  if (props.request){
    loadTbData(props.request, false)
  }else if (Array.isArray(props.data)) {
    loadDataDirect(props.data)
    return
  }
}
function loadTbData(request: requestFnType, isAppend: Boolean) {
  loadFlag.value = true
  console.log(request,isAppend);
  
}
function loadDataDirect(data: NonNullable<DataTableProps['data']>) {
  tableData.value = data
  loadFlag.value = false
}

</script>
<template>
  <n-data-table v-bind="$attrs" v-bind:style="{ 'overflow-x': 'hidden' }" size="small" :single-line="false"/>
</template>

<style scoped lang='scss'></style>