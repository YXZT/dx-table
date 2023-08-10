import { h } from 'vue';
import { NTag } from 'naive-ui'
import Mock from "mockjs";

export type simpleDataType = {
  key: number,
  name: string,
  age: number,
  address: string,
  tags: Array<string>
}
const simpleColumns = [
  {
    type: 'selection',
    key: 'selection',
    sorter: true,
    // multiple: false,
  },
  {
    title: 'Name',
    key: 'name',
    sorter: true,
  },
  {
    title: 'Age',
    key: 'age',
    sorter: true,
  },
  {
    title: 'Address',
    key: 'address',
    sorter: true,
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
    },
  },
  {
    title: '分数',
    key: 'num',
    render:()=>{
      return '123'
    }
  }
]
const simpleData = Mock.mock({
  'list|100': [{
    'key1|+1': 1,
    'name': "@cname",
    "age|1-100": 1,
    "address": "@province" + "@city" + "@county",
    "tags|1-3": ["@ctitle(2,5)"],
    "num": "@natural(1,9000)"
  }]
}
).list
const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
    minWidth: 100,
  }))
const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-',
  startIndex = 0
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${startIndex + rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${startIndex + rowIndex}`,
        parentId: null,
        key: startIndex + rowIndex,
      }
    )
  })
// const columns = [{
//   type: 'selection',
//   fixed: 'left',
//   key: 'selection',
// }, ...generateColumns(10)]
const columns = [...generateColumns(10)]

const mockRequest = ({ pageNum, pageSize }:{ pageNum:number, pageSize:number }) => {
  const list = generateData(columns, pageSize, 'row-', (pageNum - 1) * pageSize)
  const res = new Promise((resolve) => {
    setTimeout(() => {
      const res = {
        status: 0,
        data: {
          pageNum,
          pageSize,
          total: 1000,
          records: list
        }
      }
      resolve(res)
    }, 1000)
  })
  return res
}
export {
  simpleColumns,
  simpleData,
  columns as mockColumns,
  mockRequest
}