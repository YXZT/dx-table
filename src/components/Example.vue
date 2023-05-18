<template>
  <div>
    <n-tabs v-model:value="type">
      <n-tab-pane :name="1" tab="简单数据">
        <table-search :searchData="searchData" :search-columns="searchColumns"></table-search>
        <div>{{ searchData }}</div>
        <dx-table :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
          storeName="test_table1" :row-props="rowProps" v-model:checked-row-keys="checkedRowKeys"
          v-model:checkedRows="checkedRows" />
        <n-button @click="setSelected">打钩</n-button>
        <div>{{ checkedRowKeys }}</div>
        <div>{{ checkedRows }}</div>
        <n-card embedded :bordered="false">
          基于Naive UI的数据表格Data
          Table组件，使用属性透传保留了原本的有的功能，在此基础上做了一些功能扩展。增加了列顺序、列显隐、列固定的自定义配置，为了让程序正确识别，需要在colums中设置列的key，不能重复。
          刷新网页后配置就丢失了怎么行！只要给每个表格一个独特的store-name就可以找到啦。
        </n-card>
      </n-tab-pane>
      <n-tab-pane :name="2" tab="长列表">
        <dx-table :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
          storeName="test_table2" v-model:checked-row-keys="checkedRowKeys2" v-model:checkedRows="checkedRows2" />
        <div>{{ checkedRowKeys2 }}</div>
        <div>{{ checkedRows2 }}</div>
        <n-card embedded :bordered="false">
          只要添加virtual-scroll属性，就能让表格支持虚拟滚动，处理大量数据的卡顿问题,目前开源的组件库里我比较了下这个做的最好，所以我才选择用这个组件库封装。
        </n-card>
      </n-tab-pane>
      <n-tab-pane :name="3" tab="异步获取">
        <dx-table :columns="columns" :request="request" virtual-scroll :style="{ height: `400px` }" flex-height
          :scroll-x="1200" storeName="test_table3" is-pagination />
        <n-card embedded :bordered="false">
          实际工作中数据往往是异步函数返回的，这时可以传入返回promise的异步函数request来代替原本的data，组件内部会处理返回的请求。节省代码的代价就是失去了自由度，因为返回的格式数据是每个公司不一定的，可以根据实际需要自己修改。
        </n-card>
      </n-tab-pane>
      <n-tab-pane :name="4" tab="无限滚动">
        <dx-table :columns="columns" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
          storeName="test_table4" :request="request" needInfinite />
        <n-card embedded :bordered="false">
          无限滚动也是常见的需求，添加needInfinite就可以自动监测滚动和发送的请求啦。或许可以把监测的时间提前，这样提前请求，加上去掉load动画，用户体验会更好点。
        </n-card>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="tsx">
import { ref, watch } from 'vue';
import DxTable from "../lib/DxTable.vue";
import TableSearch from "../lib/TableSearch.vue";
import { NTabs, NTabPane, NCard, NButton } from 'naive-ui'
import type { requestFnType, searchFormType } from "@/interface";
import {
  mockColumns,
  mockData,
  mockRequest,
  simpleColumns,
  simpleData,
  type simpleDataType
} from "./request";

const data = ref<any[] | undefined>(undefined)
const columns = ref(mockColumns)
const request = ref<requestFnType<any> | undefined>(undefined)
const checkedRowKeys = ref<Array<string | number>>([])
const checkedRows = ref<Array<any>>([])
const checkedRowKeys2 = ref<Array<string | number>>([])
const checkedRows2 = ref<Array<any>>([])
let type = ref(1)
watch(type, (val) => {
  if (val === 1) {
    data.value = simpleData
    request.value = undefined
    columns.value = simpleColumns
  }
  else if (val === 2) {
    data.value = mockData
    request.value = undefined
    columns.value = mockColumns
  } else if (val === 3) {
    data.value = undefined
    request.value = mockRequest
    columns.value = mockColumns
  } else if (val === 4) {
    data.value = undefined
    request.value = mockRequest
    columns.value = mockColumns
  }
}, {
  immediate: true
})
const rowProps = (row: simpleDataType) => {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      console.log(row.name)
    }
  }
}
function setSelected() {
  checkedRowKeys.value = [1, 2]
}

const searchColumns: searchFormType[] = [{
  prop: "username",
  label: "用户姓名",
  search: { el: "input" },
},
{
  prop: "gender",
  label: "性别",
  search: {
    el: "select", props: {
      options: [{
        label: '男',
        value: '男'
      }, {
        label: '女',
        value: '女'
      }]
    }
  }
},
{ prop: "idCard", label: "身份证号", search: { el: "input" } },
{
  prop: "email", label: "邮箱", search: {
    el: "input",
    // xs: {
    //   span: 1,
    //   offset: 0
    // },
    // md: {
    //   span: 2,
    //   offset: 0
    // },
  }
},
{
  prop: "userStatus",
  label: "用户状态",
  search: {
    el: "select",
  },
  // 自定义 search 显示内容
  // render: ({searchParam}) => {
  //   return (
  //     <div class="flx-center">
  //       {searchParam.gender}
  //     </div>
  //   )
  // }
},
{
  prop: "createTime",
  label: "创建时间",
  search: {
    el: "date-picker",
    span: 1,
  },
},
{
  prop: "date",
  label: "时间范围",
  search: {
    el: "date-picker",
    span: 2,
    props: { type: 'daterange' }
  }
}
]

const searchData = ref({
  username: '',
  gender: null,
  idCard: null,
  email: null,
  userStatus: null,
  createTime: null,
})
</script>

<style scoped></style>

