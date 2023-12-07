<script setup lang='ts'>
import { NSelect, type SelectProps } from "naive-ui";
import { computed, useAttrs } from "vue";

interface myPropType extends  /* @vue-ignore */ SelectProps {
  isEdit?: boolean,
  label: any,
}
defineProps<myPropType>()

type otherPropsType = Pick<myPropType, 'size' | 'placeholder' | 'filterable'>

const attrs = useAttrs()

const otherProps: otherPropsType = {
  size: 'small',
  placeholder: '',
  filterable: true,
}
const thisAttrs = computed(() => {
  return {
    ...otherProps,
    ...attrs,
  }
})

</script>
<template>
  <n-select v-bind="thisAttrs" class="all-ground" v-if="isEdit" :persistent="false"></n-select>
  <div v-else class="all-ground ellipsis-area">{{ label }}</div>
</template>

<style scoped lang='scss'></style>