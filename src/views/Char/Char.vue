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
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import SuperChart from '../../components/SuperChart.vue'
import {
  BigNumberChartPlugin,
  BigNumberPeriodOverPeriodChartPlugin,
  BigNumberTotalChartPlugin,
  EchartsAreaChartPlugin,
  EchartsBoxPlotChartPlugin,
  EchartsBubbleChartPlugin,
  EchartsFunnelChartPlugin,
  EchartsGaugeChartPlugin,
  EchartsGraphChartPlugin,
  EchartsHeatmapChartPlugin,
  EchartsHistogramChartPlugin,
  EchartsMixedTimeseriesChartPlugin,
  EchartsPieChartPlugin,
  EchartsRadarChartPlugin,
  EchartsSankeyChartPlugin,
  EchartsSunburstChartPlugin,
  EchartsTimeseriesBarChartPlugin,
  EchartsTimeseriesChartPlugin,
  EchartsTimeseriesLineChartPlugin,
  EchartsTimeseriesScatterChartPlugin,
  EchartsTimeseriesSmoothLineChartPlugin,
  EchartsTimeseriesStepChartPlugin,
  EchartsTreeChartPlugin,
  EchartsTreemapChartPlugin,
  EchartsWaterfallChartPlugin
} from '@superset-ui/plugin-chart-echarts'
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../../utils/content'
import getChartDataRequest from '../../utils/chartAction'
import { SupersetClient } from '@superset-ui/core'

new EchartsBoxPlotChartPlugin().configure({ key: 'box_plot' }).register()
new EchartsTimeseriesChartPlugin()
  .configure({ key: 'echarts_timeseries' })
  .register()
new EchartsAreaChartPlugin().configure({ key: 'echarts_area' }).register()
new EchartsTimeseriesBarChartPlugin()
  .configure({ key: 'echarts_timeseries_bar' })
  .register()
new EchartsTimeseriesLineChartPlugin()
  .configure({ key: 'echarts_timeseries_line' })
  .register()
new EchartsTimeseriesScatterChartPlugin()
  .configure({ key: 'echarts_timeseries_scatter' })
  .register()
new EchartsTimeseriesSmoothLineChartPlugin()
  .configure({
    key: 'echarts_timeseries_smooth'
  })
  .register()
new EchartsTimeseriesStepChartPlugin()
  .configure({
    key: 'echarts_timeseries_step'
  })
  .register()
new EchartsMixedTimeseriesChartPlugin()
  .configure({
    key: 'mixed_timeseries'
  })
  .register()
new EchartsPieChartPlugin().configure({ key: 'pie' }).register()
new EchartsGraphChartPlugin().configure({ key: 'graph_chart' }).register()
new EchartsGaugeChartPlugin().configure({ key: 'gauge_chart' }).register()
new EchartsHistogramChartPlugin().configure({ key: 'histogram_v2' }).register()
new EchartsRadarChartPlugin().configure({ key: 'radar' }).register()
new EchartsFunnelChartPlugin().configure({ key: 'funnel' }).register()
new EchartsTreeChartPlugin().configure({ key: 'tree' }).register()
new EchartsHeatmapChartPlugin().configure({ key: 'heatmap_v2' }).register()
new EchartsTreemapChartPlugin().configure({ key: 'treemap_v2' }).register()
new BigNumberChartPlugin().configure({ key: 'big_number' }).register()
new BigNumberTotalChartPlugin()
  .configure({ key: 'big_number_total' })
  .register()
new BigNumberPeriodOverPeriodChartPlugin()
  .configure({
    key: 'pop_kpi'
  })
  .register()
new EchartsSunburstChartPlugin().configure({ key: 'sunburst_v2' }).register()
new EchartsBubbleChartPlugin().configure({ key: 'bubble_v2' }).register()
new EchartsSankeyChartPlugin().configure({ key: 'sankey_v2' }).register()
new EchartsWaterfallChartPlugin().configure({ key: 'waterfall' }).register()

export default defineComponent({
  name: 'Char',
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
      chartType: '',
      width,
      height,
      queriesData: [] as any,
      formData: {}
    })

    SupersetClient.configure({
      baseUrl: 'http://localhost:8088',
      mode: 'cors',
      credentials: 'include'
    })
      .init()
      .catch((error) =>
        console.error('Error initializing SupersetClient:', error)
      )

    const fetchData = async () => {
      // 获取图表信息formData
      const response = await SupersetClient.get({
        endpoint: '/api/v1/dashboard/1/charts'
      })
      const {
        json: {
          result: [{ form_data }]
        }
      } = response
      const { viz_type } = form_data
      state.chartType = viz_type
      state.formData = form_data
      // 获取图表数据queriesData
      const chartDataRequest = await getChartDataRequest({
        formData: form_data
      })
      const {
        json: {
          result: [{ data }]
        }
      } = chartDataRequest
      state.queriesData = [{ data }]
      console.log(
        'viz_type:',
        viz_type,
        ';form_data:',
        form_data,
        ';data:',
        data
      )
    }

    onMounted(() => {
      fetchData()
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