
import { useCurRow } from './useCurRow'
import type { Ref } from 'vue'
import { ref } from 'vue'

export function useKeyboardControl(curRowRef: Ref<object>, allRowRef: Ref<any[]>, rowKey: string | number = 'key') {
  const { setCurRow } = useCurRow(curRowRef, allRowRef, rowKey)
  const pressEnter = ref(()=>{})

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCurRow('up')
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCurRow('down')
    } else if (event.key === 'Enter') {
      event.preventDefault();
      pressEnter.value()
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
    stopListening,
    pressEnter
  }
}
