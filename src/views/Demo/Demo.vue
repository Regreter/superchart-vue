<template>
  <SuperChart
    :chartType="chartType"
    :width="width"
    :height="height"
    :queriesData="queriesData"
    :formData="formData"
  />
</template> 

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import SuperChart from '../../components/SuperChart.vue'
import { EchartsTimeseriesBarChartPlugin } from '@superset-ui/plugin-chart-echarts'
import data from './data'
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../../utils/content'

new EchartsTimeseriesBarChartPlugin()
  .configure({ key: 'echarts_timeseries_bar' })
  .register()

export default defineComponent({
  name: 'echarts-timeseries',
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
    const { width, height } = props
    const state = reactive({
      chartType: 'echarts_timeseries_bar',
      width,
      height,
      queriesData: [{ data }],
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
        annotation_layers: [],
        color_scheme: 'supersetColors',
        comparison_type: 'values',
        dashboards: [1],
        datasource: '3__table',
        extra_form_data: {},
        forecastInterval: 0.8,
        forecastPeriods: 10,
        groupby: [],
        legendOrientation: 'top',
        legendType: 'scroll',
        metrics: ['count'],
        only_total: true,
        order_desc: true,
        orientation: 'vertical',
        rich_tooltip: true,
        row_limit: 10000,
        show_empty_columns: true,
        show_legend: true,
        slice_id: 3,
        sort_series_type: 'sum',
        time_grain_sqla: 'P1D',
        tooltipTimeFormat: 'smart_date',
        truncateXAxis: true,
        truncate_metric: true,
        viz_type: 'echarts_timeseries_bar',
        x_axis: 'username',
        x_axis_sort_asc: true,
        x_axis_sort_series: 'name',
        x_axis_sort_series_ascending: true,
        x_axis_time_format: 'smart_date',
        x_axis_title_margin: 15,
        y_axis_bounds: [null, null],
        y_axis_format: 'SMART_NUMBER',
        y_axis_title_margin: 15,
        y_axis_title_position: 'Left'
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