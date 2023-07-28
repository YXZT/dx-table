import type { searchFormType, searchFormSetting } from "@/interface"
import { computed, ref } from "vue"
import { setStore, getStore } from "@/utils/store";

type tableSearchSetting = {
  searchData: any,
  searchColumns: searchFormType[],
  needMore?: boolean,
  needStore: boolean,
  storeName: string,
}

type tableSearchConfigType = {
  tableSearchProps: Readonly<tableSearchSetting>,
}
function useTableSearchConfig({ tableSearchProps }: tableSearchConfigType) {
  const { searchColumns } = tableSearchProps
  let storageString: string | null
  const localColums = ref<searchFormSetting[]>([])

  const tableSearchColumns = computed(()=>{
    const arr = localColums.value.filter(
      col => col.isShow,
    )
    return arr
  })

  function initColums() {
    let columsResult: searchFormSetting[] = searchColumns.map((col, index) => {
      const newCol: searchFormSetting = {
        ...col,
        isShow: col.isShow ?? true,
      }
      return newCol
    })
    const setting = storageString && getStore(storageString)
    columsResult = setting ? extractConfiguration(columsResult, setting) : columsResult
    localColums.value = columsResult
    return localColums
  }
  function extractConfiguration(colums: searchFormSetting[], columsConfig: searchFormSetting[]) {
    const columsContent: Array<searchFormSetting | undefined> = [...colums]
    const columsResult: searchFormSetting[] = []
    columsConfig.forEach(record => {
      const curColIndex = columsContent.findIndex(col => col?.prop === record.prop)
      if (curColIndex > -1) {
        const conf = {
          isShow: record.isShow ?? true,
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
  function initNeedStorage() {
    if (tableSearchProps.needStore) {
      storageString = 'page_' + tableSearchProps.storeName + '_tableSearch'
    } else {
      storageString = null
    }
    return storageString
  }
  function init() {
    const storageString = initNeedStorage()
    const localColums = initColums()
    return {
      storageString,
      localColums
    }
  }
  function setConf() {
    setStore(storageString as string, localColums.value)
  }
  function removeSearchColumns(item:searchFormSetting){
    const curColIndex = localColums.value.findIndex(col => col?.prop === item.prop)
    if (curColIndex > -1) {
      localColums.value[curColIndex].isShow = false
    }
    // todo 去掉当前搜索项
    storageString && setConf()
  }
  return {
    init,
    tableSearchColumns,
    removeSearchColumns
  }
}
export default useTableSearchConfig
