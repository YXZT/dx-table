import { ref, toRaw, unref, watch } from "vue"
import { NInput } from "naive-ui";

function useTableModal() {
  const tableOriginRow = ref()
  const tableOriginIndex = ref<number>()
  const trigger = ref()

  const showModalSelect = ref(false)
  const showModalSelectLeft = ref(0)
  const showModalSelectTop = ref(0)


  function showModal(e: any,row:any,index:number) {
    showModalSelect.value = true
    // 记录
    trigger.value = e.target
    tableOriginRow.value = row
    tableOriginIndex.value = index

    const pos = e.target.parentNode.parentNode.getBoundingClientRect()
    showModalSelectLeft.value = pos.left
    showModalSelectTop.value = pos.top + pos.height
  }
  function closeModal(fn?: ((arg0: { row: any; index: number | undefined; }) => void) | undefined) {
    showModalSelect.value = false
    trigger.value && trigger.value.focus()
    fn && fn({
      row: tableOriginRow.value,
      index: tableOriginIndex.value,
    })
  }
  watch(showModalSelect, (val) => {
    if (!val) {
      closeModal()
    }
  })
  return {
    showModalSelect,
    showModalSelectLeft,
    showModalSelectTop,
    showModal,
    closeModal,
    NInput,
  }
}

export default useTableModal