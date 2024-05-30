<script setup lang='ts'>
import { ref, watch } from 'vue';


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
  }
})
let display = ref(false)

watch(() => props.showModalSelect, (newVal) => {
  display.value = newVal
})
watch(() => display.value, (newVal) => {
  if (newVal) {
    // document.body.addEventListener('click', () => {
    //   display.value = false
    //   emit('update:showModalSelect', false)
    // })
  }
})


const emit = defineEmits(['update:showModalSelect'])

</script>

<template>
  <div
    class="s-modal"
    v-show="display"
    :style="{ left: showModalSelectLeft + 'px', top: (showModalSelectTop) + 'px' ,'width':width}"
  >
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