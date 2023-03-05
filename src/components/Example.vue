<template>
  <div>
    <NDataTable :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
      :single-line="false" />
    <dx-table :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height :scroll-x="1200"
      :single-line="false" storeName="test_table" />
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import DxTable from "../lib/DxTable.vue";
import { NDataTable, NTag, type DataTableColumn } from 'naive-ui'
import type { ColumnProps, columnSetting, paginationType, resType } from "@/interface";
import axios from "axios";
// const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
//   Array.from({ length }).map((_, columnIndex) => ({
//     ...props,
//     key: `${prefix}${columnIndex}`,
//     dataKey: `${prefix}${columnIndex}`,
//     title: `Column ${columnIndex}`,
//     width: 150,
//   }))

// const generateData = (
//   columns: ReturnType<typeof generateColumns>,
//   length = 200,
//   prefix = 'row-'
// ) =>
//   Array.from({ length }).map((_, rowIndex) => {
//     return columns.reduce(
//       (rowData, column, columnIndex) => {
//         rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
//         return rowData
//       },
//       {
//         id: `${prefix}${rowIndex}`,
//         parentId: null,
//       }
//     )
//   })

// const columns = generateColumns(10)
// const data = ref(generateData(columns, 1000))


const columns = ref<ColumnProps[]>([
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
      const tags = row.tags.map((tagKey: any) => {
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
])
const data = ref([{
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
}])

// 获取课程信息
async function getSubjects() {
  let { data } = await axios.get("http://www.bingjs.com:81/Subject/GetAll");
  const Subjects = data;
  console.log(Subjects);
}
getSubjects()
// 获取年级信息
async function getGrades() {
  let { data } = await axios.get("http://www.bingjs.com:81/Grade/GetAll");
  const Grades = data;
  console.log(Grades);
}
  getGrades()
</script>

<style scoped></style>
