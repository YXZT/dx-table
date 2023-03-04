<template>
  <div>
    <NDataTable :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }"
      flex-height />
    <dx-table :columns="columns" :data="data" virtual-scroll :style="{ height: `400px` }" flex-height />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DxTable from "../lib/DxTable.vue";
import { NDataTable } from 'naive-ui'
let msg = ref('hello')

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
// const data = generateData(columns, 1000)

const columns = ref([{
  title: 'Name',
  key: 'name'
},
{
  title: 'Age',
  key: 'age',
  isShow:true,
},
{
  title: 'Address',
  key: 'address',
  isShow:false,
}])
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

</script>

<style scoped></style>
