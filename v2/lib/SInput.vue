<script setup lang='ts'>
import type { tableConfigType } from '@/interface';
import { NInputNumber } from 'naive-ui'
import type { InputNumberProps } from 'naive-ui'
import { computed, useAttrs, type Ref, inject } from 'vue';

interface myPropType extends  /* @vue-ignore */ InputNumberProps {
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
  parse
}
const themeOverrides = {
  Input:{
    heightSmall : '100%',
    lineHeight : '100%'
  }
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <NInputNumber v-bind="{ ...otherProps, ...attrs }" class="all-ground"/>
  </n-config-provider>
</template>

<style lang="scss" scoped>
.all-ground {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
}
</style>