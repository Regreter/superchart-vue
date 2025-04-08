<template>
  <div v-if="queriesData && queriesData[0]?.data?.length === 0">
    {{ 'No results were returned for this query' }}
  </div>
  <div v-else ref="reactRootRef"></div>
</template>

<script lang="tsx">
import {
  ref,
  onMounted,
  onUpdated,
  defineComponent,
  onBeforeUnmount
} from 'vue'
import React from 'react'
import ReactDOM from 'react-dom'
import { SuperChart, supersetTheme } from '@superset-ui/core'
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
// new EchartsGaugeChartPlugin().configure({ key: 'gauge_chart' }).register()
new EchartsGaugeChartPlugin().configure({ key: 'echarts-gauge' }).register()
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
new EchartsWaterfallChartPlugin()
  .configure({ key: 'echarts-waterfall' })
  .register()

export default defineComponent({
  name: 'SuperChartWrapper',
  props: {
    chartType: String,
    queriesData: Array as any,
    formData: Object,
    width: [String, Number],
    height: [String, Number]
  },
  setup(props) {
    const reactRootRef = ref(null)

    // 创建 React 元素
    const createReactElement = () => {
      if (!props.chartType) return
      return React.createElement(SuperChart, {
        chartType: props.chartType,
        queriesData: props.queriesData,
        formData: props.formData,
        width: props.width,
        height: props.height,
        theme: supersetTheme,
      })
    }

    // 渲染方法
    const renderReact = () => {
      // 如果没有根节点，直接返回
      if (!reactRootRef.value) return
      // 创建 React 根实例
      const reactElement = createReactElement();
      if (reactElement) ReactDOM.render(reactElement, reactRootRef.value);
    }

    // 初始化时渲染
    onMounted(renderReact)
    // 更新时重新渲染
    onUpdated(renderReact)
    // 组件销毁时卸载 React
    onBeforeUnmount(() => {
      if(reactRootRef.value) ReactDOM.unmountComponentAtNode(reactRootRef.value);
    })

    return { reactRootRef }
  }
})
</script>