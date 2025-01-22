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
import { EchartsWaterfallChartPlugin } from '@superset-ui/plugin-chart-echarts'
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../../utils/content'

new EchartsWaterfallChartPlugin().configure({ key: 'waterfall' }).register()

export default defineComponent({
  name: 'Waterfall',
  components: {
    SuperChart
  },
  props: {
    width: {
      type: Number,
      default: DEFAULT_WIDTH
    },
    height: {
      type: Number,
      default: DEFAULT_HEIGHT
    }
  },
  setup(props) {
    const state = reactive({
      chartType: 'waterfall',
      width: props.width,
      height: props.height,
      data: data,
      formData: {
        adhoc_filters: [
          {
            clause: 'WHERE',
            comparator: 'No filter',
            expressionType: 'SIMPLE',
            operator: 'TEMPORAL_RANGE',
            subject: 'last_login'
          }
        ],
        dashboards: [1],
        datasource: '3__table',
        decrease_color: {
          a: 1,
          b: 85,
          g: 67,
          r: 224
        },
        extra_form_data: {},
        groupby: [],
        increase_color: {
          a: 1,
          b: 137,
          g: 193,
          r: 90
        },
        metric: 'count',
        row_limit: 10000,
        slice_id: 4,
        time_grain_sqla: 'P1D',
        total_color: {
          a: 1,
          b: 102,
          g: 102,
          r: 102
        },
        viz_type: 'waterfall',
        x_axis: 'id',
        x_axis_time_format: 'smart_date',
        x_ticks_layout: 'auto',
        y_axis_format: 'SMART_NUMBER'
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