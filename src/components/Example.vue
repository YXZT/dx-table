<template>
  <div>
    <n-tabs v-model:value="type">
      <n-tab-pane :name="1" tab="简单数据">
        <NDataTable :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height
          :scroll-x="1200" :single-line="false" />
        <dx-table :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
          :single-line="false" storeName="test_table" />
      </n-tab-pane>
      <n-tab-pane :name="2" tab="长列表">
        <NDataTable :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height
          :scroll-x="1200" :single-line="false" />
        <dx-table :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
          :single-line="false" storeName="test_table" />
      </n-tab-pane>
      <n-tab-pane :name="3" tab="异步获取">
        <NDataTable :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height
          :scroll-x="1200" :single-line="false" />
        <dx-table :columns="columns" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
          :single-line="false" storeName="test_table" :request="request" needInfinite />
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
  mockRequest
} from "./request";
import axios from "axios";


const simpleColumns = [
  {
    type: 'selection',
    fixed: 'left',
    key: 'selection',
    resizable: true
  },
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Age',
    key: 'age',
    isShow: true,
  },
  {
    title: 'Address',
    key: 'address',
    isShow: true,
  },
  {
    title: 'Tags',
    key: 'tags',
    render(row: any) {
      console.log(row.tags);

      const tags = row.tags && row.tags.map((tagKey: any) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: 'info',
            bordered: false
          },
          {
            default: () => tagKey
          }
        )
      })
      return tags
    }
  },
]
const simpleData = [{
  key: 0,
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
  tags: ['nice', 'developer']
},
{
  key: 1,
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
  tags: ['wow']
},
{
  key: 2,
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher']
}]
const data = ref<any[] | undefined>(undefined)
const columns = ref(mockColumns)
type requestFnType = (params: any) => Promise<resType>
const request = ref<requestFnType | undefined>(undefined)
let type = ref(1)
let needInfinite = ref(true)
watch(type, (val) => {
  if (val === 1) {
    data.value = mockData
    request.value = undefined
    columns.value = mockColumns
    needInfinite.value = false
  }
  else if (val === 2) {
    data.value = simpleData
    request.value = undefined
    columns.value = simpleColumns
    needInfinite.value = false
  } else if (val === 3) {
    data.value = undefined
    request.value = mockRequest
    columns.value = mockColumns
    needInfinite.value = true
  }
}, {
  immediate: true
})

</script>

<style scoped></style>
