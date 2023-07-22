<script setup lang='ts'>
import type { searchFormType } from '@/interface';
import SearchFormItem from './SearchFormItem.vue';
import { NFormItem, NButton, NConfigProvider, type GlobalThemeOverrides, NSpace } from 'naive-ui'

defineOptions({ name: 'TableSearch' })


type tableSearchProps = {
  searchData: any,
  searchColumns: searchFormType[],
  needMore?: boolean,
}

const props = withDefaults(defineProps<tableSearchProps>(), {
  needMore: false,
})

</script>

<template>
  <div class="search">
    <n-form-item v-for="(item, index) in searchColumns" :key="item.prop" :label="`${item.label} :`" size="small"
      :show-feedback="false" label-placement="left">
      <SearchFormItem :column="item" :search-param="searchData" />
    </n-form-item>
  </div>
</template>

<style scoped lang='scss'>
.search {
  overflow: hidden;
  background-color: #F2F2F2;
  padding: 10px 12px 0 4px;
  display: flex;
  flex-wrap: wrap;
}
.search>div{
  padding-bottom: 4px;
  padding-left: 6px;
}
</style>