<template>
  <div class="filter-item">
    <div v-for="(filter, index) in filterItems" :key="index">
      <label>{{ filter.name }}:</label>
      <FilterItem
        ref="filterItemRefs"
        v-if="filter.chartType"
        :chartType="filter.chartType"
        :queriesData="filter.queriesData[0]"
        :formData="filter.formData"
      />
    </div>
  </div>
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
      return filterItemRefs.value.map((e) => e.filter).flat()
    })

    defineExpose({
      filters
    })

    return {
      filterItemRefs,
      filters
    }
  }
})
</script>
<style lang="css" scoped>
.filter-item {
  /* display: inline-flex; */
}
</style>