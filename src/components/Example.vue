<template>
  <div>
    <n-tabs v-model:value="type">
      <n-tab-pane :name="1" tab="简单数据">
        <dx-table :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
          storeName="test_table1" />
        <n-card embedded :bordered="false">
          基于Naive UI的数据表格Data
          Table组件，使用属性透传保留了原本的有的功能，在此基础上做了一些功能扩展。增加了列顺序、列显隐、列固定的自定义配置，为了让程序正确识别，需要在colums中设置列的key，不能重复。
          刷新网页后配置就丢失了怎么行！只要给每个表格一个独特的save-name就可以找到啦。
        </n-card>
      </n-tab-pane>
      <n-tab-pane :name="2" tab="长列表">
        <dx-table :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
          storeName="test_table2" />
        <n-card embedded :bordered="false">
          只要添加virtual-scroll属性，就能让表格支持虚拟滚动，处理大量数据的卡顿问题,目前开源的组件库里我比较了下这个做的最好，所以我才选择用这个组件库封装的。
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

<script setup lang="ts">
import { ref, watch } from 'vue';
import DxTable from "../lib/DxTable.vue";
import { NTabs, NTabPane, NCard } from 'naive-ui'
import type { requestFnType } from "@/interface";
import {
  mockColumns,
  mockData,
  mockRequest,
  simpleColumns,
  simpleData,
} from "./request";

const data = ref<any[] | undefined>(undefined)
const columns = ref(mockColumns)
const request = ref<requestFnType | undefined>(undefined)
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

</script>

<style scoped></style>
