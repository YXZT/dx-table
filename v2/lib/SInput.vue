<script setup lang='ts'>
import type { tableConfigType } from '@/interface';
import { NInputNumber } from 'naive-ui'
import type { InputNumberProps } from 'naive-ui'
import { computed, useAttrs,inject, nextTick } from 'vue';

interface myPropType extends  /* @vue-ignore */ InputNumberProps {
  isEdit?: boolean,
}
const attrs = useAttrs()

defineProps<myPropType>()

type otherPropsType = Pick<myPropType, 'precision' | 'size' | 'showButton' | 'clearable' | 'placeholder' | 'format' | 'parse'>

// 接收注入tableConfig
const tableConfig: tableConfigType = inject('tableConfig') || {}

const format = (value: number | null) => {
  if (value === null) return "";
  if (tableConfig.moneySplit) {
    return value.toLocaleString('en-US')
  } else {
    return value + "";
  }
};

const parse = (input: string) => {
  const nums = input.replace(/,/g, '').trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
  return nums === '' ? null : Number.NaN
}

const otherProps: otherPropsType = {
  precision: 2,
  size: 'small',
  showButton: false,
  clearable: false,
  placeholder: '',
  format,
  parse,
}
const thisAttrs = computed(() => {
  return {
      ...otherProps,
      ...attrs,
      onClick: (e: any) => {
        if(!tableConfig.inplutFocusSelectAll) return
        // 不加nextTick，鼠标mouseup的时候会取消选择
        nextTick(()=>{
          e.target.select()
        })
      }
    }
})
</script>

<template>
  <NInputNumber v-bind="thisAttrs" class="all-ground input-style" v-if="isEdit" />
  <div v-else class="input-style ellipsis-area">{{ attrs.value }}</div>
</template>

<style lang="scss" scoped>
.all-ground {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;

  :deep(.n-input__input-el) {
    height: 100%;
    line-height: 100%;
  }
}

.input-style {
  text-align: right;
}
</style>