<template>
  <div style="background-color:#eee">
    <n-config-provider :theme-overrides="themeOverrides">
      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
        <GridItem v-for="(item, index) in searchColumns" :key="item.prop" v-bind="getResponsive(item)" :index="index">
          <n-form-item :label="`${item.label} :`" size="small" :show-feedback="false">
            <template #label>
              <div class="ctg-flex-between">
                <div>
                  {{ `${item.label} :` }}
                </div>
                <n-popselect v-model:value="item.searchType" :options="labelOptions">
                  <n-button quaternary>{{ item.searchType }}</n-button>
                </n-popselect>
              </div>
            </template>
            <SearchFormItem :column="item" :search-param="searchData" />
          </n-form-item>
        </GridItem>
        <GridItem suffix>
          <div class="operation">
            <n-space>
              <n-button type="primary" @click="search">搜索</n-button>
              <n-button @click="reset">重置</n-button>
              <n-button quaternary type="primary" @click="showMoreSearch" v-if="needMore">更多></n-button>
              <n-button v-if="showCollapse" icon-placement="right" type="primary" quaternary
                @click="collapsed = !collapsed">
                {{ collapsed ? "展开" : "合并" }}
                <template #icon>
                  <n-icon>
                    <component :is="collapsed ? ArrowDown : ArrowUp"></component>
                  </n-icon>
                </template>
              </n-button>
            </n-space>
          </div>
        </GridItem>
      </Grid>
    </n-config-provider>
  </div>
</template>

<script setup lang='ts'>
import Grid from "@/lib/Grid/index.vue";
import GridItem from "@/lib/Grid/components/GridItem.vue";
import { computed, ref } from "vue"
import type { BreakPoint, searchFormType } from "@/interface";
import {  NFormItem, NButton, NConfigProvider, type GlobalThemeOverrides,NSpace } from 'naive-ui'
import { ArrowDown, ArrowUp } from '@vicons/ionicons5'
import SearchFormItem from './SearchFormItem.vue'
defineOptions({ name: 'TableSearch' })
const emits = defineEmits(['search', 'reset', 'showMoreSearch'])
const themeOverrides: GlobalThemeOverrides = {
  Form: {
    feedbackHeightSmall: '4px',
    labelPaddingVertical: '0 0 0 2px'
  },
}
type tableSearchProps = {
  searchData: any,
  searchColumns: searchFormType[],
  searchCol?: number | Record<BreakPoint, number>;
  needMore?: boolean,
  // search?: (params: any) => void; // 搜索方法
  // reset?: (params: any) => void; // 重置方法
}
const props = withDefaults(defineProps<tableSearchProps>(), {
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
  needMore: false,
})
// 获取响应式设置
const getResponsive = (item: searchFormType) => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl
  };
};

// 是否默认折叠搜索项
const collapsed = ref(true);

// 获取响应式断点
const gridRef = ref();
const breakPoint = computed<BreakPoint>(() => gridRef.value?.breakPoint);

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  let show = false;
  props.searchColumns.reduce((prev, current) => {
    prev +=
      ((current.search && current.search![breakPoint.value]?.span) ?? current.search?.span ?? 1) +
      ((current.search && current.search![breakPoint.value]?.offset) ?? current.search?.offset ?? 0);
    if (typeof props.searchCol !== "number") {
      if (prev >= props.searchCol[breakPoint.value]) show = true;
    } else {
      if (prev >= props.searchCol) show = true;
    }
    return prev;
  }, 0);
  return show;
});
function search() {
  emits('search')
}
function reset() {
  emits('reset')
}
function showMoreSearch() {
  emits('showMoreSearch')
}
const labelOptions = [{
  label: '包含',
  value: '包含'
}, {
  label: '不包含',
  value: '不包含'
}, {
  label: '等于',
  value: '等于'
}]
</script>
<style lang="scss" scoped>
.operation {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding-bottom: 4px;
  height: 100%;
  box-sizing: border-box;
}
:deep(.n-form-item.n-form-item--top-labelled .n-form-item-label) {
  align-items: center;
}

:deep(.n-form-item-label__text) {
  width: 100%;
}
</style>