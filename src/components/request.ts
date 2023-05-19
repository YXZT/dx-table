import type { ColumnProps, resType } from "@/interface";
import { h } from 'vue';
import { NTag } from 'naive-ui'
import Mock from "mockjs";
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
        id: `${prefix}${rowIndex}`,
        parentId: null,
        key: rowIndex,
      }
    )
  })

const columns = [{
  type: 'selection',
  fixed: 'left',
  key: 'selection',
  resizable: true,
  isShow: true,
}, ...generateColumns(10)]
const data = generateData(columns, 1000)
type requestFnType = (params: any) => Promise<resType<any>>
const mockRequest: requestFnType = ({ pageNum, pageSize }) => {
  const list = generateData(columns, pageSize, 'row-', (pageNum - 1) * pageSize)
  const res = new Promise<resType<any>>((resolve) => {
    setTimeout(() => {
      const res: resType<any> = {
        status: 0,
        data: {
          pageNum,
          pageSize,
          total: 1000,
          records: list
        }
      }
      resolve(res)
    }, 2000)
  })
  return res
}

export type simpleDataType = {
  key: number,
  name: string,
  age: number,
  address: string,
  tags: Array<string>
}
const simpleColumns: ColumnProps<simpleDataType>[] = [
  {
    type: 'selection',
    fixed: 'left',
    key: 'selection',
    resizable: true,
    isShow: true,
    // multiple: false,
  },
  {
    title: 'Name',
    key: 'name',
    sorter: true,
    order: 8
  },
  {
    title: 'Age',
    key: 'age',
    sorter: true,
    order: 7
  },
  {
    title: 'Address',
    key: 'address',
    sorter: true,
    order: 6
  },
  {
    title: 'Tags',
    key: 'tags',
    render(row) {
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
]
const simpleData: simpleDataType[] = Mock.mock({
  'list|100': [{
    'key|+1': 1,
    'name': "@cname",
    "age|1-100": 1,
    "address": "@province" + "@city" + "@county",
    "tags|1-3": ["@ctitle(2,5)"]
  }]
}
).list

export {
  columns as mockColumns,
  data as mockData,
  simpleColumns,
  simpleData,
  mockRequest
}