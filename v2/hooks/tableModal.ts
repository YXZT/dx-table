import { ref } from "vue"
import { NInput } from "naive-ui";

function useTableModal() {
  const showModalSelect = ref(false)
  const showModalSelectLeft = ref(0)
  const showModalSelectTop = ref(0)
  function showModal(e: any) {
    const pos = e.target.parentNode.parentNode.getBoundingClientRect()
    showModalSelect.value = true
    showModalSelectLeft.value = pos.left
    showModalSelectTop.value = pos.top + pos.height
  }
  return {
    showModalSelect,
    showModalSelectLeft,
    showModalSelectTop,
    showModal,
    NInput,
  }
}

export default useTableModal