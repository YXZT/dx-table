import type { ColumnsProps, columnSetting, columnsSetting, paginationType, requestFnType } from "@/interface"
import type { DataTableProps } from "naive-ui";
import { setStore, getStore } from "@/utils/store";
import { computed, ref, type Ref } from "vue";
interface tablePropType extends /* @vue-ignore */ Omit<DataTableProps, 'columns' | 'rowKey'> {
  columns: ColumnsProps,
  request?: requestFnType,
  data?: Array<any>,
  isPagination?: boolean,
  needInfinite?: boolean,
  rowKey?: string,
  immediateRequest?: boolean,
  needStore?: boolean,
  storeName?: string,
}

type pageChangeType = {
  tableProps: Readonly<tablePropType>,
  loadDataFn: Function
}
function useTableConfig({ tableProps,loadDataFn }: pageChangeType) {
  let storageString: string | null
  let tableRowKey: DataTableProps['rowKey']
  const localColums = ref<columnsSetting>([])
  
  const TableColumns = computed(() => {
    const arr = localColums.value.filter(
      col => col.isShow,
    ).map(col => {
      const _col: any = { ...col }
      if (_col.fixed === 'none') _col.fixed = undefined
      return _col
    })
    arr.unshift({
      title: '',
      key: 'key',
      render: (_: any, index: number) => {
        return `${index + 1}`
      },
      fixed: 'left',
      width: '50',
      align: 'center',
      cellProps: () => {
        return {
          style: { 'background': 'linear-gradient(180deg, #E2EEFE 0%, #F2F6FC 49%, #E2EEFE 100%)', 'border-right-color': '#6C9ABF' },
        }
      }
    })
    return arr as DataTableProps['columns']
  })
  function initNeedStorage() {
    if (tableProps.needStore) {
      storageString = 'page_' + tableProps.storeName || 'default' + '_table'
    } else {
      storageString = null
    }
    return storageString
  }
  function initRowKey() {
    const rowKey = tableProps.rowKey || 'key'
     tableRowKey = tableProps.rowKey ? (row: any) => {
      return row[rowKey]
    } : undefined
    return tableRowKey
  }
  function extractConfiguration(colums: columnsSetting, columsConfig: columnsSetting) {
    const columsContent: Array<columnSetting | undefined> = [...colums]
    const columsResult: columnsSetting = []
    columsConfig.forEach(record => {
      const curColIndex = columsContent.findIndex(col => col?.key === record.key)
      if (curColIndex > -1) {
        const conf = {
          isShow: record.isShow,
          width: record.width,
          fixed: record.fixed,
          order: record.order,
          sorter: record.sorter,
        }
        columsResult.push(Object.assign({}, columsContent[curColIndex], conf))
        columsContent[curColIndex] = undefined
      }
    });

    columsContent.forEach(col => {
      if (col) columsResult.push(col)
    })
    return columsResult
  }
  function initColums() {
    let columsResult = tableProps.columns.map((col, index) => {
      const newCol: columnSetting = {
        ...col,
        isShow: col.isShow ?? true,
        fixed: col.fixed ?? 'none',
        resizable: col.resizable ?? true,
        order: col.order ?? index,
        sorter: col.sorter ?? false,
        sortOrder: col.sortOrder ?? false,
        titleAlign: col.titleAlign ?? 'center',
        width: col.width ?? undefined,
      }
      return newCol
    })
    const setting = storageString && getStore(storageString)
    columsResult = setting ? extractConfiguration(columsResult, setting) : columsResult
    localColums.value = columsResult
    return localColums
  }
  function initLoadData(){
    if (tableProps.immediateRequest !== false) {
      loadDataFn()
    }
  }
  function init() {
    const storageString = initNeedStorage()
    const tableRowKey = initRowKey()
    const localColums = initColums()
    initLoadData()
    return {
      storageString,
      tableRowKey,
      localColums,
    }
  }
  function setConf() {
    setStore(storageString as string, localColums.value)
  }
  const localSearchSort = computed(() => {
    if (!localColums.value.length) return []
    return localColums.value.filter(row => row.sorter).sort((a, b) => { return a.order - b.order })
  })
  function changeCol(col: columnSetting) {
    const index = localColums.value.findIndex(item => {
      return item.key === col.key
    })
    if (index > -1) {
      localColums.value[index] = col
    }
    storageString && setConf()
  }
  function changeSequence(oldIndex: number, newIndex: number) {
    const temp = localColums.value[oldIndex];
    localColums.value[oldIndex] = localColums.value[newIndex];
    localColums.value[newIndex] = temp;
    storageString && setConf()
  }
  function changeSortOrder(oldIndex: number, newIndex: number) {
    const temp = localColums.value[oldIndex].order;
    localColums.value[oldIndex].order = localColums.value[newIndex].order;
    localColums.value[newIndex].order = temp;
    storageString && setConf()
  }
  const resetConf = () => {
    const columsResult = tableProps.columns.map((col, index) => {
      const newCol: columnSetting = {
        ...col,
        isShow: col.isShow ?? true,
        fixed: col.fixed ?? 'none',
        resizable: col.resizable ?? true,
        order: col.order ?? index,
        sorter: col.sorter ?? false,
        sortOrder: col.sortOrder ?? false,
        titleAlign: col.titleAlign ?? 'center',
      }
      return newCol
    })
    localColums.value = columsResult
    storageString && setConf()
  }
  // 类型有问题
  const handleSorterChange = (sorter: any) => {
    localColums.value.forEach((column) => {
      if (column.sortOrder === undefined) return
      if (column.key === sorter.columnKey) column.sortOrder = sorter.order
    })
  }

  const columDragEnd = (resizedWidth: number, limitedWidth: number, column: any) => {
    const index = localColums.value.findIndex(ele=>ele.key === column.key)
    localColums.value[index].width = limitedWidth
    storageString && setConf()
  }

  
  return {
    init,
    initNeedStorage,
    initRowKey,
    initColums,
    initLoadData,
    TableColumns,
    localSearchSort,
    changeCol,
    changeSequence,
    changeSortOrder,
    resetConf,
    handleSorterChange,
    columDragEnd
  }
}
export default useTableConfig