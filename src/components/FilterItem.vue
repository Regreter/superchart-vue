<template>
  <div>
    <a-select
      v-if="chartType === 'filter_select'"
      size="small"
      mode="multiple"
      style="width: 200px"
      v-model:value="selectValue"
      allowClear
      placeholder="请选择"
    >
      <a-select-option
        v-for="option in queriesData.data"
        :key="option[queriesData.colnames[0]]"
        :value="option[queriesData.colnames[0]]"
        >{{ option[queriesData.colnames[0]] }}
      </a-select-option>
    </a-select>
    <a-slider
      v-else-if="chartType === 'filter_range'"
      v-model:value="sliderValue"
      range
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, defineExpose, computed } from 'vue'

export default defineComponent({
  props: {
    chartType: String,
    queriesData: Array as any
  },
  setup(props) {
    const selectValue = ref([])
    const sliderValue = ref()

    const filter = computed(() => {
      if (props.chartType === 'filter_select') {
        return selectValue.value.length > 0
          ? [
              {
                col: props.queriesData.colnames[0],
                op: 'IN',
                val: selectValue.value
              }
            ]
          : []
      } else if (props.chartType === 'filter_range') {
        return [
          {
            col: props.queriesData.colnames[0],
            op: '>=',
            val: sliderValue.value[0]
          },
          {
            col: props.queriesData.colnames[0],
            op: '<=',
            val: sliderValue.value[1]
          }
        ]
      }
      return []
    })

    defineExpose({
      filter
    })

    return {
      selectValue,
      sliderValue,
      filter
    }
  }
})
</script>