
import { useCurRow } from './useCurRow'
import type { Ref } from 'vue'

export function useKeyboardControl(curRowRef: Ref<object>, allRowRef: Ref<any[]>, rowKey: string | number = 'key') {
  const { setCurRow } = useCurRow(curRowRef, allRowRef, rowKey)

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCurRow('up')
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCurRow('down')
    }
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
    stopListening
  }
}
