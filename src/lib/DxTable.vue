<template>
  <TableConfig :tableRef="dataTable" :tableCols="localColums" @change-show="changeColShow"></TableConfig>
  <NDataTable v-bind="$attrs" :columns="TableColumns" :data="tableData" ref="dataTable" />
  <div @click="showCol">对对对</div>
  <!-- 分页 -->
  <!-- <slot name="pagination">
    <el-pagination v-if="isPagination" :layout="props.layout" :v-model:page-sizee="localPagination.pageSize" v-model:current-page="localPagination.pageNum"
      :total="localPagination.total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
  </slot> -->
</template>
 
<script setup lang="ts">
import type { ColumnProps,columnSetting, paginationType, resType } from "@/interface";
import Sortable from "sortablejs";
import { NDataTable } from 'naive-ui'
import type { DataTableProps } from 'naive-ui'
import TableConfig from './TableConfig.vue'
import { ref, reactive, getCurrentInstance, type PropType, type Ref, onMounted, watch, computed } from 'vue'

type requestFnType = (params: any) => Promise<resType>
interface tablePropType extends Omit<DataTableProps, 'columns'> {
  data?: Array<any>,
  request?: requestFnType,
  columns: ColumnProps[],
  immediateRequest?: boolean,
  needInfinite?: boolean
}
const props = withDefaults(defineProps<tablePropType>(), {
  immediateRequest: false,
  needInfinite: false,
})
// const props = defineProps({
//   ...tableV2Props,
//   layout: { type: String, default: 'prev, pager, next, jumper, ->, total' },
//   request: {
//     type: Object as requestFnType,
//     required: false
//   },
//   immediateRequest: {
//     type: Boolean,
//     required: false
//   },

//   pagination: {
//     type: Object as PropType<Omit<paginationType, 'total'>>,
//     required: false,
//     default: () => ({ pageSize: 20, pageNum: 1 })
//   },
//   isPagination: {
//     type: Boolean,
//     default: true,
//   },
//   needInfinite: {
//     type: Boolean,
//     default: true,
//   },
// })
const emits = defineEmits(['refreshed'])
const cur = getCurrentInstance();
const proxy = cur && cur.proxy
// 是否开始加载
const loadFlag = ref(false)
let tableData = ref<any>([])
loadData()
let localPagination = reactive(Object.assign({ total: 0, pageSize: 20, pageNum: 1 }, props.pagination))
function loadData(pagination?: paginationType) {
  if (Array.isArray(props.data)) {
    loadDataDirect()
    return
  }
  if (!props.request) return
  loadFlag.value = true
  const parameter = {
    pageNum:
      (pagination && pagination.pageNum) || localPagination.pageNum,
    pageSize:
      (pagination && pagination.pageSize) || localPagination.pageSize
  }
  const result = props.request(parameter)
  result.then(res => {
    loadFlag.value = false
    if (props.pagination || props.needInfinite) {
      localPagination =
        Object.assign({}, localPagination, {
          pageNum: res?.data?.pageNum, // 返回结果中的当前分页数
          pageSize: res?.data?.pageSize,
          total: res?.data?.total || 0 // 返回结果中的总记录数
        })
      tableData.value = res.data?.records
    }
  })
}
// 追踪传过来原本的prop并加以改造
const localColums = ref<columnSetting[]>([])
watch(props.columns,(newVal)=>{
  localColums.value = newVal.map(col=>{
    const newCol:columnSetting = {
      ...col,
      isShow:col.isShow === undefined ? true : col.isShow
    }
    return newCol
  })
},{
  immediate:true
})
const TableColumns = computed(()=>{
  const arr:columnSetting[] = localColums.value.filter(
    col => col.isShow
  )
  return arr
}) 
const dataTable = ref<InstanceType<typeof NDataTable> | null>(null)
function loadDataDirect() {
  tableData.value = props.data
}

onMounted(() => {
  columnDrop()
})
function showCol(){
  console.log(TableColumns);
}
function columnDrop() {
  const el = dataTable?.value?.$el
  const wrapperTr = el.querySelector(".n-data-table-tr");
  console.log(wrapperTr);
  Sortable.create(wrapperTr, {
    animation: 180,
    delay: 0,
    filter: ".drag-filtered",
    onEnd: (evt) => {
      const oldIndex = evt.oldIndex;
      const newIndex = evt.newIndex;
      if(!oldIndex || !newIndex) return
      let temp = localColums.value[oldIndex];
      localColums.value[oldIndex] = localColums.value[newIndex];
      localColums.value[newIndex] = temp;
    }
  });
}
function changeColShow(col:columnSetting){
  const index = localColums.value.findIndex(item=>{
    return item.key === col.key
  })
  if(index>-1){
    // TableColumns.value[index] = col
    const isShow = col.isShow === undefined ? true : col.isShow
    localColums.value[index] = col
  }
}
</script>
 
<style scoped></style>
 