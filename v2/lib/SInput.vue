<script setup lang='ts'>
import { NInputNumber } from 'naive-ui'
import type { InputNumberProps } from 'naive-ui'

interface myPropType extends  /* @vue-ignore */ InputNumberProps {
}

defineProps<myPropType>()

</script>

<template>
  <NInputNumber v-bind="$attrs"/>
</template>

<style lang="scss" scoped>

</style>