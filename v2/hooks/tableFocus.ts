import { ref } from "vue";

function useTableFocus() {
  const isFocus = ref(false)
  const handleFocus = () => {
    isFocus.value = true
  }
  const handleBlur = () => {
    isFocus.value = false
  }
  const toggleFocus = () => {
    isFocus.value = !isFocus.value
  }
  return { isFocus, handleFocus, handleBlur, toggleFocus }
}

export default useTableFocus