<template>
  <div>
    <n-tabs type="segment" v-model:value="type">
      <n-tab :name="1">简单数据
      </n-tab>
      <n-tab :name="2">长列表
      </n-tab>
      <n-tab :name="3">异步获取
      </n-tab>
    </n-tabs>
    <NDataTable :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
      :single-line="false" />
    <dx-table :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
      :single-line="false" storeName="test_table" />
  </div>
</template>

<script setup lang="ts">
import { ref, h, watch } from 'vue';
import DxTable from "../lib/DxTable.vue";
import { NDataTable, NTag, type DataTableColumn, NTabs, NTab } from 'naive-ui'
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
      
      const tags = row.tags&&row.tags.map((tagKey: any) => {
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
let type = ref(1)
watch(type, (val) => {
  if (val === 1) {
    data.value = mockData
    columns.value = mockColumns
  }
  else if (val === 2) {
    data.value = simpleData
    columns.value = simpleColumns
  }
}, {
  immediate: true
})
</script>

<style scoped></style>
