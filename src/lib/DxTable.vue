<template>
  <TableConfig :tableRef="dataTable" :tableCols="localColums" @change-show="changeCol" @change-sequence="changeSequence"
    @change-fixed="changeCol"></TableConfig>
  <NDataTable v-bind="$attrs" :columns="TableColumns" :data="tableData" ref="dataTable" :loading="loadFlag"
    @scroll="scroll" :pagination="pagination" remote @update:page-size="handleSizeChange"
    @update:page="handlePageChange" />
</template>
 
<script setup lang="ts">
import type { ColumnProps, columnSetting, paginationType, requestFnType } from "@/interface";
import { NDataTable } from 'naive-ui'
import type { DataTableProps, DataTableColumn } from 'naive-ui'
import TableConfig from './TableConfig.vue'
import { ref, watch, computed } from 'vue'
import { setStore } from "@/utils/store";

interface tablePropType extends Omit<DataTableProps, 'columns'> {
  data?: Array<any>,
  request?: requestFnType,
  columns: ColumnProps<any>[],
  immediateRequest?: boolean,
  needInfinite?: boolean,
  storeName?: string,
  isPagination?: boolean,
}
const props = withDefaults(defineProps<tablePropType>(), {
  immediateRequest: false,
  needInfinite: false,
  isPagination: false,
})
const emits = defineEmits(['refreshed'])
// 是否开始加载
const loadFlag = ref(false)
let tableData = ref<any>([])
watch([() => props.data, () => props.request], () => {
  refresh(true)
})
let localPagination = ref({ total: 0, pageSize: 20, pageNum: 1 })
let pagination = computed(() => {
  if (props.needInfinite) return undefined
  if (!props.isPagination) return undefined
  return {
    page: localPagination.value.pageNum,
    pageSize: localPagination.value.pageSize,
    itemCount: localPagination.value.total,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
  }
})
function handlePageChange(val: number) {
  if (loadFlag.value) return
  localPagination.value.pageNum = val;
  loadData();
  emits('refreshed')
}
function handleSizeChange(val: number) {
  if (loadFlag.value) return
  localPagination.value.pageSize = val;
  // 获取最大页数
  const pageMax = Math.ceil(localPagination.value.total / val);
  // 判断跳转页数是否大于最大页数，如果大于，跳转页数就等于最大页数
  if (localPagination.value.pageNum > pageMax) {
    localPagination.value.pageNum = pageMax;
  }
  loadData();
  emits('refreshed')
}
loadData()
function loadTbData(request: requestFnType, isAppend: Boolean, pagination?: paginationType) {
  loadFlag.value = true
  const parameter = {
    pageNum:
      (pagination && pagination.pageNum) || localPagination.value.pageNum,
    pageSize:
      (pagination && pagination.pageSize) || localPagination.value.pageSize
  }
  const result = request(parameter)
  result.then(res => {
    loadFlag.value = false
    if (props.isPagination || props.needInfinite) {
      localPagination.value =
        Object.assign({}, localPagination.value, {
          pageNum: res?.data?.pageNum, // 返回结果中的当前分页数
          pageSize: res?.data?.pageSize,
          total: res?.data?.total || 0 // 返回结果中的总记录数
        })
    }
    const records = (res.data?.records) as Array<any>
    if (isAppend) {
      tableData.value.push(...records)
    } else {
      tableData.value = records
    }
  }).catch(()=>{
    loadFlag.value = false
    tableData.value = []
    localPagination.value = { total: 0, pageSize: 20, pageNum: 1 }
  })
}
function loadData(pagination?: paginationType) {
  if (Array.isArray(props.data)) {
    loadDataDirect()
    return
  }
  if (!props.request) return
  loadTbData(props.request, false, pagination)
}
// 追踪传过来原本的prop并加以改造
const localColums = ref<columnSetting<any>[]>([])
watch(() => props.columns, (newVal) => {
  let columsResult = newVal.map(col => {
    let newCol: columnSetting<any> = {
      ...col,
      isShow: col.isShow === undefined ? true : col.isShow,
      fixed: col.fixed === undefined ? 'none' : col.fixed,
      resizable: col.resizable === undefined ? true : col.resizable,
    }
    return newCol
  })
  // let setting = props.storeName && getStore(props.storeName)
  let setting = undefined
  columsResult = setting ? ExtractConfiguration(columsResult, setting) : columsResult
  localColums.value = columsResult
}, {
  immediate: true
})
const TableColumns = computed(() => {
  const arr: DataTableColumn<any>[] = localColums.value.filter(
    col => col.isShow,
  ).map(col => {
    const _col: any = { ...col }
    if (_col.fixed === 'none') _col.fixed = undefined
    return _col
  })
  return arr
})
function ExtractConfiguration(colums: columnSetting<any>[], columsConfig: columnSetting<any>[]) {
  let columsContent: columnSetting<any>[] | undefined[] = [...colums]
  let columsResult: columnSetting<any>[] = []
  columsConfig.forEach(record => {
    let curColIndex = columsContent.findIndex(col => col?.key === record.key)
    if (curColIndex > -1) {
      const conf = {
        isShow: record.isShow,
        width: record.width,
        fixed: record.fixed,
      }
      columsResult.push(Object.assign({}, columsContent[curColIndex], conf))
      columsContent[curColIndex] = undefined
    }
  });

  columsContent.forEach(col => {
    if (col) columsResult.push(col)
  })
  return columsResult
}


const dataTable = ref<InstanceType<typeof NDataTable> | null>(null)
function loadDataDirect() {
  tableData.value = props.data
}
function setConf() {
  props.storeName && setStore(props.storeName, localColums.value)
}
function changeCol(col: columnSetting<any>) {
  const index = localColums.value.findIndex(item => {
    return item.key === col.key
  })
  if (index > -1) {
    localColums.value[index] = col
  }
  setConf()
}
function changeSequence(oldIndex: number, newIndex: number) {
  let temp = localColums.value[oldIndex];
  localColums.value[oldIndex] = localColums.value[newIndex];
  localColums.value[newIndex] = temp;
  setConf()
}
const scroll: DataTableProps['onScroll'] = (event) => {
  if (!props.needInfinite || !props.request) return;
  if (loadFlag.value) return
  const dom = event.target as HTMLDivElement;
  const clientHeight = dom.clientHeight;
  const scrollTop = dom.scrollTop;
  const scrollHeight = dom.scrollHeight;
  if (clientHeight + scrollTop === scrollHeight) {
    const num = Math.ceil(
      localPagination.value.total / localPagination.value.pageSize
    );
    if (localPagination.value.pageNum + 1 > num) {
      return;
    }
    localPagination.value.pageNum += 1
    loadTbData(props.request, true)
  }
}
function refresh(reset?: boolean) {
  if (reset) {
    localPagination.value = { total: 0, pageSize: localPagination.value.pageSize, pageNum: 1 }
  }
  loadData();
}
defineExpose({
  refresh
})
</script>
 
<style scoped></style>
 