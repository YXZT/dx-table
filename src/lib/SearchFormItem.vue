<template>
  <component
    :is="column.search?.render ?? `u-${column.search?.el}`"
    v-model.trim="searchParam[column.search?.key ?? handleProp(column.prop!)]"
  >
  </component>
</template>

<script setup lang="ts" name="SearchFormItem">
import type { searchFormType } from "@/interface";
import { computed, inject, ref } from "vue";

interface SearchFormItem {
  column: searchFormType;
  searchParam: { [key: string]: any };
}
const props = defineProps<SearchFormItem>();

// 判断 fieldNames 设置 label && value && children 的 key 值
const fieldNames = computed(() => {
  return {
    label: props.column.fieldNames?.label ?? "label",
    value: props.column.fieldNames?.value ?? "value",
    children: props.column.fieldNames?.children ?? "children"
  };
});


</script>
