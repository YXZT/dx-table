import { ref } from "vue"
import { NInput } from "naive-ui";

function useTableModal() {
  const showModalSelect = ref(false)
  const showModalSelectLeft = ref(0)
  const showModalSelectTop = ref(0)

  const trigger = ref()

  function showModal(e: any) {
    const pos = e.target.parentNode.parentNode.getBoundingClientRect()
    showModalSelect.value = true
    showModalSelectLeft.value = pos.left
    showModalSelectTop.value = pos.top + pos.height
    trigger.value = e.target
  }
  function closeModal() {
    showModalSelect.value = false
  }
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