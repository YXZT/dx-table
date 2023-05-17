<template>
  <div style="background-color:#eee">
    <n-config-provider :theme-overrides="themeOverrides">
      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
        <GridItem v-for="(item, index) in searchColumns" :key="item.prop" v-bind="getResponsive(item)" :index="index">
          <n-form-item :label="`${item.label} :`" size="small">
            <!-- <SearchFormItem :column="item" :search-param="searchData" /> -->
            <n-input></n-input>
          </n-form-item>
        </GridItem>
        <GridItem suffix>
          <div class="operation">
            <n-space>
              <n-button type="primary" @click="search">搜索</n-button>
              <n-button @click="reset">重置</n-button>
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
import { NForm, NFormItem, NButton, NIcon, NInput, NConfigProvider, type GlobalThemeOverrides,NSpace } from 'naive-ui'
import { ArrowDown, ArrowUp } from '@vicons/ionicons5'
import { } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  Form: {
    feedbackHeightSmall: '4px'
  },
}
type tableSearchProps = {
  searchData: any,
  searchColumns: searchFormType[],
  searchCol: number | Record<BreakPoint, number>;
  search?: (params: any) => void; // 搜索方法
  reset?: (params: any) => void; // 重置方法
}
const props = withDefaults(defineProps<tableSearchProps>(), {
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 })
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
      (current.search![breakPoint.value]?.span ?? current.search?.span ?? 1) +
      (current.search![breakPoint.value]?.offset ?? current.search?.offset ?? 0);
    if (typeof props.searchCol !== "number") {
      if (prev >= props.searchCol[breakPoint.value]) show = true;
    } else {
      if (prev >= props.searchCol) show = true;
    }
    return prev;
  }, 0);
  return show;
});
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
</style>