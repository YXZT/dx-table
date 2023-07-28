import type { searchFormType,searchFormSetting } from "@/interface"
import { ref } from "vue"

type tableSearchConfigType = {
  searchColumns: searchFormType[],
}
function useTableSearchConfig({ searchColumns }: tableSearchConfigType) {
  let storageString: string | null
  const tableSearchColumns = ref<searchFormSetting[]>([])
  function initColums(){
    const columsResult: searchFormSetting[] = searchColumns.map((col, index) => {
      const newCol: searchFormSetting = {
        ...col,
        isShow: col.isShow ?? true,
      }
      return newCol
    })
    // const setting = storageString && getStore(storageString)
    // columsResult = setting ? ExtractConfiguration(columsResult, setting) : columsResult
    tableSearchColumns.value = columsResult
  }
  function initNeedStorage() {
    // if (tableProps.needStore) {
    //   storageString = tableProps.storeName || 'default'
    // } else {
    //   storageString = null
    // }
    // return storageString
  }
  function init(){
    const storageString = initNeedStorage()
    initColums()
  }
  return {
    init,
    tableSearchColumns
  }
}
export default useTableSearchConfig
