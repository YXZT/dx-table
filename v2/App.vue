<script setup lang="ts">
import Example from "./components/Example.vue";
import { NConfigProvider,NModalProvider } from "naive-ui";
const themeOverrides = {
  common: {
    primaryColor: '#238EFE',
    primaryColorHover: '#2E82A9FF',
    primaryColorPressed: '#366A9FFF',
    primaryColorSuppl: '#2E82A9FF',
    textColorBase: '#238EFE'
  },
  DataTable:{
    thPaddingSmall: '2px 12px 2px 4px',
    tdPaddingSmall: '4px 8px',
    fontSizeSmall: '12px',
    borderColor: '#D2D2D2',
    thIconColorActive: '#055FE0',
  }
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-modal-provider>
      <Example />
    </n-modal-provider>
  </n-config-provider>
</template>

<style scoped>

</style>
