<template>
  <div>
    <n-tabs v-model:value="type">
      <n-tab-pane :name="1" tab="长列表">
        <dx-table :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
           storeName="test_table" />
      </n-tab-pane>
      <n-tab-pane :name="2" tab="简单数据">
        <dx-table :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
           storeName="test_table"/>
      </n-tab-pane>
      <n-tab-pane :name="3" tab="异步获取">
          <dx-table :columns="columns" :request="request" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
           storeName="test_table" is-pagination/>
      </n-tab-pane>
      <n-tab-pane :name="4" tab="无限滚动">
        <dx-table :columns="columns" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
           storeName="test_table" :request="request" needInfinite />
      </n-tab-pane>
    </n-tabs>

  </div>
</template>

<script setup lang="ts">
import { ref, h, watch } from 'vue';
import DxTable from "../lib/DxTable.vue";
import { NDataTable, NTag, type DataTableColumn, NTabs, NTabPane } from 'naive-ui'
import type { ColumnProps, columnSetting, paginationType, resType } from "@/interface";
import {
  mockColumns,
  mockData,
  mockRequest ,
  simpleColumns,
  simpleData,
} from "./request";
import axios from "axios";



const data = ref<any[] | undefined>(undefined)
const columns = ref(mockColumns)
type requestFnType = (params: any) => Promise<resType>
const request = ref<requestFnType | undefined>(undefined)
let type = ref(1)
watch(type, (val) => {
  if (val === 1) {
    data.value = mockData
    request.value = undefined
    columns.value = mockColumns
  }
  else if (val === 2) {
    data.value = simpleData
    request.value = undefined
    columns.value = simpleColumns
  } else if (val === 3) {
    data.value = undefined
    request.value = mockRequest
    columns.value = mockColumns
  }else if (val === 4) {
    data.value = undefined
    request.value = mockRequest
    columns.value = mockColumns
  }
}, {
  immediate: true
})

</script>

<style scoped></style>
