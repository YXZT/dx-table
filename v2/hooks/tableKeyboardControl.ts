
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { DataTableProps, NDataTable } from 'naive-ui'
import type { ColumnsProps, requestFnType, tableCheckType } from '@/interface'
import type { setCurrentFocusRowType } from './tableRow'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import type { selectToggleRowType } from './tableSelect'
import { getParentTD } from '@/utils'

type optionsType = {
  currentFocusRowIndex: Readonly<Ref<number | null>>,
  setCurrentFocusRow: setCurrentFocusRowType,
  dataTable: Readonly<Ref<InstanceType<typeof NDataTable> | null>>,
  tableData: Readonly<Ref<any[]>>,
  selectToggleRow: selectToggleRowType,
  tableCheck: Ref<tableCheckType>,
  listenFlag: () => Boolean
}


function useKeyboardControl(options: optionsType) {
  const { dataTable, tableData, currentFocusRowIndex, setCurrentFocusRow, selectToggleRow, tableCheck, listenFlag } = options
  let curentTd: HTMLElement | null
  let curentCol: string = ''
  function handleKeyDown(event: KeyboardEvent) {
    if (!listenFlag()) {
      return
    }
    const dom = event.target
    const _dom = getParentTD(dom)
    if (_dom) {
      curentTd = _dom.dom
      curentCol = curentTd?.getAttribute('data-col-key') || ''
    }
    // console.log(dom?.__vue__ || dom?.parentNode.__vue__ || null);

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
      if (currentFocusRowIndex.value == null) return
      selectToggleRow(tableData.value[currentFocusRowIndex.value])
    }
  }
  function scrollToRow() {
    dataTable?.value?.scrollTo({ index: currentFocusRowIndex.value } as any)
  }

  function startListening() {
    window.addEventListener('keydown', handleKeyDown)
  }

  function stopListening() {
    window.removeEventListener('keydown', handleKeyDown)
  }
  type commandType = 'up' | 'down'
  function setCurRow(command: commandType) {
    const tableLength = tableData.value.length
    let nextTd: Element | null | undefined = null
    if (tableLength === 0) return
    if (currentFocusRowIndex.value == null) return
    const needSetSelectRow = tableCheck.value === 'radio'
    // todo 1 改造成按index选定 2 focus没有全选
    switch (command) {
      case 'up':
        if (currentFocusRowIndex.value === 0) return
        if (curentTd) {
          nextTd = (curentTd.parentNode as HTMLElement).previousElementSibling?.querySelector(`td[data-col-key = '${curentCol}']`)
        }
        setCurrentFocusRow({ index: currentFocusRowIndex.value - 1, curentTd: nextTd })
        needSetSelectRow && selectToggleRow(tableData.value[currentFocusRowIndex.value])
        break;
      case 'down':
        if (currentFocusRowIndex.value === tableLength - 1) return
        if (curentTd) {
          nextTd = (curentTd.parentNode as HTMLElement).nextElementSibling?.querySelector(`td[data-col-key = '${curentCol}']`)
        }
        setCurrentFocusRow({ index: currentFocusRowIndex.value + 1, curentTd:nextTd })
        needSetSelectRow && selectToggleRow(tableData.value[currentFocusRowIndex.value])
        break;
      default:
        break;
    }
  }
  return {
    startListening,
    stopListening,
    scrollToRow,
  }
}
export default useKeyboardControl