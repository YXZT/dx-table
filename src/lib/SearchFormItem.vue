<!-- eslint-disable vue/no-mutating-props -->
<template>
  <component :is="column?.render ?? `n-${column.search?.el}`"
    v-bind="{ ...handleSearchProps, ...placeholder, searchParam, clearable }"
    v-model:value.trim="searchParam[column.prop]">
  </component>
</template>

<script setup lang="ts">
import type { searchFormType } from "@/interface";
import { computed, inject, ref } from "vue";
import { NInput, NCheckbox, NCheckboxGroup, NDatePicker, NInputNumber, NRadio, NSelect, NSwitch, NMention } from 'naive-ui'
defineOptions({ name: "SearchFormItem", components: { NInput, NCheckbox, NCheckboxGroup, NDatePicker, NInputNumber, NRadio, NSelect, NSwitch, NMention } })
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

// 处理透传的 searchProps (el 为 tree-select、cascader 的时候需要给下默认 label && value && children)
const handleSearchProps = computed(() => {
  // const label = fieldNames.value.label;
  // const value = fieldNames.value.value;
  // const children = fieldNames.value.children;
  const searchEl = props.column.search?.el;
  let searchProps = props.column.search?.props ?? {};
  if (searchEl === "date-picker") {
    searchProps = { ...searchProps,style:{'width':'100%'} }
  }
  // if (searchEl === "tree-select") {
  //   searchProps = { ...searchProps, props: { ...searchProps.props, label, children }, nodeKey: value };
  // }
  // if (searchEl === "cascader") {
  //   searchProps = { ...searchProps, props: { ...searchProps.props, label, value, children } };
  // }
  return searchProps
});

// 处理默认 placeholder
const placeholder = computed(() => {
  // const search = props.column.search;
  // if (["datetimerange", "daterange", "monthrange"].includes(search?.props?.type) || search?.props?.isRange) {
  //   return { rangeSeparator: "至", startPlaceholder: "开始时间", endPlaceholder: "结束时间" };
  // }
  // const placeholder = search?.props?.placeholder ?? (search?.el?.includes("input") ? "请输入" : "请选择");
  // return { placeholder };
  return { placeholder: '' }
});

// 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
const clearable = computed(() => {
  const search = props.column.search;
  return search?.props?.clearable ?? (search?.defaultValue == null || search?.defaultValue == undefined);
});
</script>
