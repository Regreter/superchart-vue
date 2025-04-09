<template>
  <a-form layout="inline">
    <a-form-item
      v-for="(filter, index) in filterItems"
      :key="index"
      :label="filter.name"
    >
      <FilterItem
        ref="filterItemRefs"
        v-if="filter.chartType"
        :chartType="filter.chartType"
        :queriesData="filter.queriesData[0]"
        :formData="filter.formData"
      />
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import { defineComponent, ref, defineExpose, computed } from 'vue'
import FilterItem from './FilterItem.vue'

export default defineComponent({
  components: {
    FilterItem
  },
  props: {
    filterItems: Array as any
  },
  setup() {
    const filterItemRefs = ref<InstanceType<typeof FilterItem>[]>([])
    const filters = computed(() => {
      return filterItemRefs.value.map((e) => e?.filter).flat()
    })
    const time_range = computed(() => {
      return filterItemRefs.value
        .filter((e) => e.chartType === 'filter_time' || e.time_range === '')
        .map((m) => m.time_range)[0]
    })

    defineExpose({
      filters,
      time_range
    })

    return {
      filterItemRefs,
      filters,
      time_range
    }
  }
})
</script>
<style scoped>
:deep(.ant-form-item-label > label) {
  width: 70px !important;
}
</style>