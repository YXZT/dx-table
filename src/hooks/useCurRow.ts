import { ref, type Ref } from 'vue'
import type { myRowType } from "@/interface";

type commandType = 'up' | 'down'

export function useCurRow(curRowRef: Ref<object>, allRowRef: Ref<any[]>, rowKey: string) {
  function getCurIndex() {
    if (!allRowRef.value.length) return null
    if (!Object.keys(curRowRef.value).length) return null
    const index = allRowRef.value.findIndex(row => {
      return row[rowKey] === (curRowRef.value as myRowType)[rowKey]
    })
    return index
  }
  const index = ref(getCurIndex())

  function setCurRow(command: commandType) {
    if (index.value === null) index.value = getCurIndex()
    if (index.value === null) return
    const tableLength = allRowRef.value.length
    switch (command) {
      case 'up':
        if (index.value === 0) return
        index.value--
        curRowRef.value = allRowRef.value[index.value]
        break;
      case 'down':
        if (index.value === tableLength - 1) return
        index.value++
        curRowRef.value = allRowRef.value[index.value]
        break;
      default:
        break;
    }
  }
  return {
    setCurRow
  }
}