<script setup lang='ts'>
import { nextTick, ref, toRef, watch } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { setPageModalCount } from '../utils/globalStore.ts'
const props = defineProps({
  showModalSelect: {
    type: Boolean,
    default: false
  },
  showModalSelectLeft: {
    type: Number,
    default: 0
  },
  showModalSelectTop: {
    type: Number,
    default: 0
  },
  width: {
    type: String,
    default: '200px'
  },
})


const emit = defineEmits(['update:showModalSelect', 'update:showModalSelectLeft', 'update:showModalSelectTop'])

const target = ref<HTMLDivElement>()

// 重新计算宽高
function recalculateSize() {
  const targetRect = target.value?.getBoundingClientRect()
  if (!targetRect) return
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const left = Math.min(Math.max(0, props.showModalSelectLeft), windowWidth - targetRect.width)
  const top = Math.min(Math.max(0, props.showModalSelectTop), windowHeight - targetRect.height)
  emit('update:showModalSelectLeft', left)
  emit('update:showModalSelectTop', top)
}

// 自动focus该dom下第一个可focus的元素
function autoFocus() {
  const focusableElements = target.value?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  if (!focusableElements) return
  const firstFocusableElement = focusableElements[0] as HTMLElement
  firstFocusableElement.focus()
}

onClickOutside(target, (event) => {
  console.log(event)
  emit('update:showModalSelect', false)
})

watch(() => props.showModalSelect, (newVal) => {
  if (newVal) {
    nextTick((): void => {
      recalculateSize()
      autoFocus()
    })
  }
})
setPageModalCount(toRef(props.showModalSelect))

</script>

<template>
  <div class="s-modal" v-if="showModalSelect"
    :style="{ left: showModalSelectLeft + 'px', top: (showModalSelectTop) + 'px', 'width': width }" ref="target">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.s-modal {
  position: absolute;
  z-index: 10;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px #ccc;
  padding: 10px;
}
</style>