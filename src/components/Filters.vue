<template>
  <div>
    <div v-for="(filter, index) in filtersItems" :key="index">
      <FilterSelect
        ref="filterSelectRefs"
        v-if="filter.chartType && filter.chartType === 'filter_select'"
        :chartType="filter.chartType"
        :width="filter.width"
        :height="filter.height"
        :queriesData="filter.queriesData[0]"
        :formData="filter.formData"
        :name="filter.name"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, defineExpose, computed } from 'vue'
import FilterSelect from './FilterSelect.vue'

export default defineComponent({
  components: {
    FilterSelect
  },
  props: {
    filtersItems: Array as any
  },
  setup() {
    const filterSelectRefs = ref<InstanceType<typeof FilterSelect>[]>([])

    const filters = computed(() => {
      return filterSelectRefs.value
        ?.filter((m) => m.selectValue.length > 0)
        .map((e) => e.filter)
    })

    defineExpose({
      filters
    })

    return {
      filterSelectRefs,
      filters
    }
  }
})
</script>