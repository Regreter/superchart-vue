<template>
  <div>
    <a-select
      v-if="chartType === 'filter_select'"
      size="small"
      mode="multiple"
      style="width: 250px"
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
      style="width: 250px"
      v-model:value="sliderValue"
      :min="queriesData.data[0].min"
      :max="queriesData.data[0].max"
      range
    />
    <a-range-picker
      v-else-if="chartType === 'filter_time'"
      size="small"
      style="width: 250px"
      v-model:value="dateValue"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, defineExpose, computed } from 'vue'
import dayjs from 'dayjs'

export default defineComponent({
  props: {
    chartType: String,
    queriesData: Array as any,
    formData: Object
  },
  setup(props) {
    const selectValue = ref([])
    const sliderValue = ref()
    const dateValue = ref([])
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
        return sliderValue.value
          ? [
              {
                col: props.formData?.groupby[0],
                op: '>=',
                val: sliderValue.value[0]
              },
              {
                col: props.formData?.groupby[0],
                op: '<=',
                val: sliderValue.value[1]
              }
            ]
          : []
      }
      return []
    })

    const time_range = computed(() => {
      return `${dayjs(dateValue.value[0]).format(
        'YYYY-MM-DD HH:mm:ss'
      )} : ${dayjs(dateValue.value[1]).format('YYYY-MM-DD HH:mm:ss')}`
    })

    defineExpose(
      props.chartType === 'filter_time' ? { time_range } : { filter }
    )

    return {
      selectValue,
      sliderValue,
      dateValue,
      filter,
      time_range
    }
  }
})
</script>