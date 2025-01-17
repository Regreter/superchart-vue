<template>
  <SuperChart
    :chartType="chartType"
    :width="width"
    :height="height"
    :queriesData="[{ data }]"
    :formData="formData"
  />
</template> 

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import data from './data'
import SuperChart from '../../components/SuperChart.vue'
import { getChartTransformPropsRegistry } from '@superset-ui/core'
import { WaterfallTransformProps } from '@superset-ui/plugin-chart-echarts'

getChartTransformPropsRegistry().registerValue(
  'echarts-waterfall',
  WaterfallTransformProps
)

export default defineComponent({
  name: 'Waterfall',
  components: {
    SuperChart
  },
  setup() {
    const state = reactive({
      chartType: 'echarts-waterfall',
      width: 500,
      height: 300,
      data: data,
      formData: {
        metric: `SUM(decomp_volume)`,
        columns: 'due_to_group',
        series: 'period',
        x_ticks_layout: '45°',
        adhocFilters: [
          {
            clause: 'WHERE',
            comparator: '0',
            expressionType: 'SIMPLE',
            filterOptionName: 'filter_8ix98su8zu4_t4767ixmbp9',
            isExtra: false,
            isNew: false,
            operator: '!=',
            sqlExpression: null,
            subject: 'period'
          }
        ]
      }
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>
/* 这里可以添加组件的样式 */
</style>