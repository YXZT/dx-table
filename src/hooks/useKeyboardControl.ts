
import { useCurRow } from './useCurRow'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { NDataTable } from 'naive-ui'
type optionsType = {
  curRowRef: Ref<object>,
  allRowRef: Ref<any[]>,
  rowKey?: string,
  dataTable: Ref<InstanceType<typeof NDataTable> | null>
}
export function useKeyboardControl(options: optionsType) {
  const { curRowRef, allRowRef, rowKey = 'key', dataTable } = options
  const { setCurRow, index } = useCurRow(curRowRef, allRowRef, rowKey)
  const pressEnter = ref(() => { })

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCurRow('up')
      scrollToRow()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCurRow('down')
      scrollToRow()
    } else if (event.key === 'Enter') {
      event.preventDefault();
      pressEnter.value()
    }
  }
  function scrollToRow() {
    dataTable?.value?.scrollTo({ index: index.value } as any)
  }

  function startListening() {
    if (!allRowRef.value.length) return
    if (Object.keys(curRowRef.value).length === 0) {
      curRowRef.value = allRowRef.value[0]
    }
    window.addEventListener('keydown', handleKeyDown)
  }

  function stopListening() {
    window.removeEventListener('keydown', handleKeyDown)
  }

  return {
    startListening,
    stopListening,
    pressEnter,
    scrollToRow,
  }
}
