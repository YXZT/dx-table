<template>
  <TableConfig :tableRef="dataTable" :dataSetting="localColums" :sortData="localSearchSort" @change-show="changeCol" @change-sequence="changeSequence"
  @change-sort-order="changeSortOrder"
    @reset-conf="resetConf" @change-fixed="changeCol">
    <slot name="title">
      <div v-show="checkedRowKeysRef?.length">已经选择：{{ checkedRowKeysRef?.length }} 条</div>
    </slot>
  </TableConfig>
  <NDataTable v-bind="$attrs" :columns="TableColumns" :data="tableData" ref="dataTable" :loading="loadFlag"
    @scroll="scroll" :pagination="pagination" remote @update:page-size="handleSizeChange" @update:page="handlePageChange"
    :row-props="tableRowProps" :checkedRowKeys="checkedRowKeysRef" @update-checked-row-keys="updateRowKeys"
    :row-key="tableRowKey" v-bind:style="{ 'overflow-x': 'hidden' }" size="small"
    :theme-overrides="dataTableThemeOverrides" />
  <div>
    {{ curRowRef }}
  </div>
</template>
 
<script setup lang="ts">
import type { ColumnProps, columnSetting, paginationType, requestFnType, myRowType } from "@/interface";
import { NDataTable, NButton } from 'naive-ui'
import type { DataTableProps, DataTableColumn } from 'naive-ui'
import TableConfig from './TableConfig.vue'
import { ref, watch, computed } from 'vue'
import { setStore, getStore } from "@/utils/store";
import { deepCopy } from "@/utils";
import { useTableSelect } from "@/hooks/useTableSelect";
import { useKeyboardControl } from '@/hooks/useKeyboardControl'

type DataTableThemeOverrides = NonNullable<DataTableProps['themeOverrides']>
const dataTableThemeOverrides: DataTableThemeOverrides = {
  thPaddingSmall: '2px',
  tdPaddingSmall: '2px'
}
interface tablePropType extends /* @vue-ignore */Omit<DataTableProps, 'columns' | 'rowKey'> {
  data?: Array<myRowType>,
  request?: requestFnType<myRowType>,
  columns: ColumnProps<any>[],
  immediateRequest?: boolean,
  needInfinite?: boolean,
  storeName?: string,
  isPagination?: boolean,
  checkedRowKeys?: DataTableProps['checkedRowKeys'],
  checkedRows?: Array<any>,
  rowProps?: DataTableProps['rowProps'],
  curRow?: myRowType,
  rowKey?: string,
}
// type tablePropType = Omit<DataTableProps, 'columns' | 'rowKey'> & {
//   data?: Array<myRowType>,
//   request?: requestFnType<myRowType>,
//   columns: ColumnProps<any>[],
//   immediateRequest?: boolean,
//   needInfinite?: boolean,
//   storeName?: string,
//   isPagination?: boolean,
//   checkedRowKeys?: DataTableProps['checkedRowKeys'],
//   checkedRows?: Array<any>,
//   rowProps?: DataTableProps['rowProps'],
//   curRow?: myRowType,
//   rowKey?: string,
// }
const props = withDefaults(defineProps<tablePropType>(), {
  immediateRequest: false,
  needInfinite: false,
  isPagination: false,
})
const rowKey = props.rowKey || 'key'
const tableRowKey = props.rowKey ? (row: any) => {
  return row[rowKey]
} : undefined

const emits = defineEmits(['refreshed', 'update:checkedRowKeys', 'update:checkedRows'])
const checkedRowKeysRef = props.checkedRowKeys ? ref(props.checkedRowKeys) : ref([])
const checkedRowsRef = props.checkedRows ? ref(props.checkedRows) : ref([])
props.checkedRowKeys && watch(() => props.checkedRowKeys, (val) => {
  if (val === undefined) return
  const data = deepCopy<typeof tableData.value>(tableData.value)
  const newData = data.filter((row: any) => val?.includes(row.key))
  checkedRowKeysRef.value = deepCopy<typeof val>(val)
  emits('update:checkedRows', newData)
})
// 是否开始加载
const loadFlag = ref(true)
let tableData = ref<myRowType[]>([])
const needStore = ref(true)
watch([() => props.data, () => props.request], () => {
  refresh(true)
})
let localPagination = ref({ total: 0, pageSize: 20, pageNum: 1 })
let localSearchSort = computed(()=>{
  return localColums.value.filter(row => row.sorter).sort((a, b) => { return a.order - b.order })
})
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

function loadTbData(request: requestFnType<myRowType>, isAppend: Boolean) {
  loadFlag.value = true
  function tranform(sortOrder:'ascend'|'descend'|boolean){
    if(sortOrder === 'ascend') return 1
    if(sortOrder === 'descend') return -1
    return null
  }
  const parameter = {
    pageNum: localPagination.value.pageNum,
    pageSize:localPagination.value.pageSize,
    sort: localSearchSort.value.map(ele=>({ [ele.key] : tranform(ele.sortOrder) }))
  }
  const result = request(parameter)
  result.then(res => {
    if (props.isPagination || props.needInfinite) {
      localPagination.value =
        Object.assign({}, localPagination.value, {
          pageNum: res?.data?.pageNum, // 返回结果中的当前分页数
          pageSize: res?.data?.pageSize,
          total: res?.data?.total || 0 // 返回结果中的总记录数
        })
    }
    const records = res.data?.records
    if (Array.isArray(records) && records.length) {
      if (isAppend) {
        tableData.value.push(...records)
      } else {
        tableData.value = records
      }
    }
    loadFlag.value = false
  }).catch(() => {
    tableData.value = []
    localPagination.value = { total: 0, pageSize: 20, pageNum: 1 }
    loadFlag.value = false
  })
}
function loadData() {
  if (Array.isArray(props.data)) {
    loadDataDirect(props.data)
    return
  }
  if (!props.request) return
  loadTbData(props.request, false)
}


// 追踪传过来原本的prop并加以改造
const localColums = ref<columnSetting<any>[]>([])
watch(() => props.columns, (newVal) => {
  let columsResult = newVal.map((col,index) => {
    let newCol: columnSetting<any> = {
      ...col,
      isShow: col.isShow ?? true,
      fixed: col.fixed ?? 'none' ,
      resizable: col.resizable ?? true,
      order: col.order ?? index,
      sorter: col.sorter ?? false,
      sortOrder: col.sortOrder ?? false,
    }
    return newCol
  })
  let setting = props.storeName && needStore.value && getStore(props.storeName)
  columsResult = setting ? ExtractConfiguration(columsResult, setting) : columsResult
  localColums.value = columsResult
}, {
  immediate: true
})

const resetConf = () => {
  let columsResult = props.columns.map((col,index) => {
    let newCol: columnSetting<any> = {
      ...col,
      isShow: col.isShow ?? true,
      fixed: col.fixed ?? 'none' ,
      resizable: col.resizable ?? true,
      order: col.order ?? index,
      sorter: col.sorter ?? false,
      sortOrder: col.sortOrder ?? false,
    }
    return newCol
  })
  localColums.value = columsResult
  needStore.value && setConf()
}

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
        order: record.order,
        sorter: record.sorter,
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
function loadDataDirect(data: myRowType[]) {
  tableData.value = data
  loadFlag.value = false
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
  needStore.value && setConf()
}
function changeSequence(oldIndex: number, newIndex: number) {
  let temp = localColums.value[oldIndex];
  localColums.value[oldIndex] = localColums.value[newIndex];
  localColums.value[newIndex] = temp;
  needStore.value && setConf()
}
function changeSortOrder(oldIndex: number, newIndex: number) {
  let temp = localColums.value[oldIndex].order;
  localColums.value[oldIndex].order = localColums.value[newIndex].order;
  localColums.value[newIndex].order = temp;
  needStore.value && setConf()
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
const options = { checkedRowKeys: checkedRowKeysRef, checkedRows: checkedRowsRef, tableData: tableData.value, columns: props.columns, emits, rowKey }
let { updateRowKeys, tableRowProps, toggleRow, rowClass } = useTableSelect(options)

rowClass.value = (row) => {
  if (!Object.keys(curRowRef.value).length) return
  if (row[rowKey] === curRowRef.value[rowKey]) {
    return ['cur-selected-row']
  } else {
    return
  }
}
const curRowRef = ref<myRowType>(props.curRow || {} as myRowType)
const trackCurRow = ref(true)
trackCurRow.value && watch(curRowRef, (val) => {
  if (!Object.keys(val).length) return
  checkedRowKeysRef.value = [val[rowKey]]
})
const { startListening, stopListening, pressEnter } = useKeyboardControl({ curRowRef: curRowRef, allRowRef: tableData, dataTable: dataTable })
pressEnter.value = () => {
  toggleRow(curRowRef.value)
}
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
 
<style scoped lang="scss">
:deep(.cur-selected-row .n-data-table-td) {
  background-color: #cfe8fb;
}

:deep(.n-data-table-tr:not(.n-data-table-tr--summary):hover) {
  background-color: var(--n-merged-td-color-hover);
}
</style>
 