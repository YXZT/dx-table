import { h } from 'vue';
import { NButton, NIcon, NTag, NTooltip } from 'naive-ui'
import { Delete48Filled, Add24Regular } from '@vicons/fluent'
import Mock from "mockjs";

const renderTooltip = (trigger: any, content: any) => {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content
  })
}

export type simpleDataType = {
  key: number,
  name: string,
  age: number,
  address: string,
  tags: Array<string>
}
const simpleColumns = [
  {
    key: 'delete',
    titleString: '[行操作]',
    fixed: 'left',
    width: '50',
    title: h('div',
      {
        class: 's-flex-center2',
        style:{
          margin: '-2px -12px -2px -4px'
        }
      },
      h(
        NButton,
        {
          quaternary: true,
          size: 'tiny',
          onClick: () => {
            console.log('clear all')
          },
        },
        {
          default: () => h(
            NIcon,
            {
              component: Delete48Filled,
              size: "22",
              color: '#f97c7c',
            }
          ),
        }
      ),
    ),
    resizable: false,
    render(row: any) {
      return h('div',
        {
          class: 's-flex-around',
          style: {
            margin: '-4px -8px', // 抵销td的padding
          }
        },
        [
          h(
            NButton,
            {
              quaternary: true,
              size: 'tiny',
              onClick: () => {
                console.log(row)
              },
            },
            {
              default: () => h(
                NIcon,
                {
                  component: Delete48Filled,
                  size: "22",
                  color: '#f97c7c',
                }
              ),
            }
          ),
          // h(
          //   NButton,
          //   {
          //     quaternary: true,
          //     size: 'tiny',
          //     onClick: () => {
          //       console.log(row)
          //     },
          //   },
          //   {
          //     default: () => h(
          //       NIcon,
          //       {
          //         component: Add24Regular,
          //         size: "22",
          //         color: '#3686b7',
          //       }
          //     )
          //   }
          // ),
        ]
      )
    }
  },
  {
    type: 'selection',
    key: 'selection',
    titleString: '[勾选框]',
    // sorter: true,
    // multiple: false,
  },
  {
    title: 'Name',
    key: 'name',
    sorter: true,
  },
  {
    title() {
      return renderTooltip(
        h(
          'div',
          {},
          'age'
        ),
        '随便写点什么'
      )
    },
    titleString: 'age',
    key: 'age',
    align: 'right',
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
    align: 'right'
  },
  {
    title: '角色',
    key: 'role',
  },
]
const simpleData = Mock.mock({
  'list|100': [{
    'key1|+1': 1,
    'name': "@cname",
    "age|1-100": 1,
    "address": "@province" + "@city" + "@county",
    "tags|1-3": ["@ctitle(2,5)"],
    "num": "@natural(1,9000)",
    "role": null,
    "roleName": null
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

const mockRequest = ({ pageNum, pageSize }: { pageNum: number, pageSize: number }) => {
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

const roleOptions = [
  {
    label: 'Drive My Car',
    value: 'id_Drive My Car'
  },
  {
    label: 'Norwegian Wood',
    value: 'id_Norwegian Wood'
  },
  {
    label: "You Won't See",
    value: "id_You Won't See",
    disabled: true
  },
  {
    label: 'Nowhere Man',
    value: 'id_Nowhere Man'
  },
  {
    label: 'Think For Yourself',
    value: 'id_Think For Yourself'
  },
  {
    label: 'The Word',
    value: 'id_The Word'
  },
  {
    label: 'Michelle',
    value: 'id_Michelle',
    disabled: true
  },
  {
    label: 'What goes on',
    value: 'id_What goes on'
  },
  {
    label: 'Girl',
    value: 'id_Girl'
  },
  {
    label: "I'm looking through you",
    value: "id_I'm looking through you"
  },
  {
    label: 'In My Life',
    value: 'id_In My Life'
  },
  {
    label: 'Wait',
    value: 'id_Wait'
  }
]

export {
  simpleColumns,
  simpleData,
  columns as mockColumns,
  mockRequest,
  roleOptions
}