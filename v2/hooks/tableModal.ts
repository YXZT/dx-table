import { defineComponent, h, ref, toRaw, watch } from "vue"
import SModal from "../lib/SModal.vue";

function useTableModal() {
  const tableOriginRow = ref()
  const tableOriginIndex = ref<number>()
  const trigger = ref()

  const showModalSelect = ref(false)
  const showModalSelectLeft = ref(0)
  const showModalSelectTop = ref(0)


  function showModal(e: any, row: any, index: number) {
    showModalSelect.value = true
    // 记录
    trigger.value = e.target
    tableOriginRow.value = toRaw(row)
    tableOriginIndex.value = index

    const pos = e.target.parentNode.parentNode.getBoundingClientRect()
    showModalSelectLeft.value = pos.left
    showModalSelectTop.value = pos.top + pos.height
  }
  function closeModal(fn?: ((arg0: { row: any; index: number | undefined; }) => void) | undefined) {
    showModalSelect.value = false
    trigger.value && trigger.value.focus()
    fn && fn({
      row: toRaw(tableOriginRow.value),
      index: tableOriginIndex.value,
    })
  }
  watch(showModalSelect, (val) => {
    if (!val) {
      closeModal()
    }
  })
  const tableModal = defineComponent({
    setup(props, { slots }) {
      return () => h(SModal, {
        'show-modal-select': showModalSelect.value,
        'show-modal-select-left': showModalSelectLeft.value,
        'show-modal-select-top': showModalSelectTop.value,
        'onUpdate:showModalSelect': (val: boolean) => {
          showModalSelect.value = val
        },
        'onUpdate:showModalSelectLeft': (val: number) => {
          showModalSelectLeft.value = val
        },
        'onUpdate:showModalSelectTop': (val: number) => {
          showModalSelectTop.value = val
        }
      }, slots)
    },
  })
  return {
    showModal,
    closeModal,
    tableModal
  }
}

export default useTableModal