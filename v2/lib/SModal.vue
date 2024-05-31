<script setup lang='ts'>
import { nextTick, ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core'

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



const emit = defineEmits(['update:showModalSelect'])

const target = ref(null)

// onClickOutside(target, (event) => {
//   console.log(props.showModalSelect)
//   emit('update:showModalSelect', false)
// },{
//   ignore:[props.ignoreRef.value]
// })
onClickOutside(target, (event) => {
  console.log(props.showModalSelect)
  // emit('update:showModalSelect', false)
})

</script>

<template>
  <div class="s-modal"
    v-if="showModalSelect"
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