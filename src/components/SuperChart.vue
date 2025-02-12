<template>
  <SuperChartCore ref="superChartCoreRef" :width="width" :height="height" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import SuperChartCore from './SuperChartCore.vue'
import { defaultTheme } from '../utils/index'
import {
  convertKeysToCamelCase,
  getChartTransformPropsRegistry
} from '@superset-ui/core'
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../utils/content'
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
  name: 'SuperChart',
  props: {
    chartType: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    },
    width: {
      type: String,
      required: true
    },
    queriesData: {
      type: Object,
      required: true
    },
    formData: {
      type: Object,
      required: true
    }
  },
  components: {
    SuperChartCore
  },
  setup(props) {
    const superChartCoreRef = ref(null) as any
    const theme = defaultTheme

    const getChart = async () => {
      const { chartType, formData, queriesData, height, width } = props

      if (
        !chartType ||
        Object.keys(formData).length === 0 ||
        queriesData.length === 0
      )
        return
      const chartProps = createChartProps({
        formData,
        queriesData,
        height,
        width,
        theme
      })
      const transformProps =
        await getChartTransformPropsRegistry().getAsPromise(chartType)
      const { echartOptions } = transformProps(chartProps)
      console.log(chartType, ':', echartOptions)

      if (superChartCoreRef.value && echartOptions)
        superChartCoreRef.value?.getChart(echartOptions)
    }

    const createChartProps = (config: any) => {
      const {
        annotationData = {},
        datasource = {},
        formData = {} as FormData,
        hooks = {},
        ownState = {},
        filterState = {},
        legendState,
        initialValues = {},
        queriesData = [],
        behaviors = ['INTERACTIVE_CHART'],
        displaySettings = {},
        width = DEFAULT_WIDTH,
        height = DEFAULT_HEIGHT,
        appSection,
        isRefreshing,
        inputRef,
        inContextMenu = false,
        emitCrossFilters = false,
        theme
      } = config
      config.width = width
      config.height = height
      config.annotationData = annotationData
      config.datasource = convertKeysToCamelCase(datasource)
      config.rawDatasource = datasource
      config.formData = convertKeysToCamelCase(formData)
      config.rawFormData = formData
      config.hooks = hooks
      config.initialValues = initialValues
      config.queriesData = queriesData
      config.ownState = ownState
      config.filterState = filterState
      config.legendState = legendState
      config.behaviors = behaviors
      config.displaySettings = displaySettings
      config.appSection = appSection
      config.isRefreshing = isRefreshing
      config.inputRef = inputRef
      config.inContextMenu = inContextMenu
      config.emitCrossFilters = emitCrossFilters
      config.theme = theme
      return config
    }

    watch(
      () => [props.chartType, props.formData, props.queriesData],
      () => {
        getChart()
      }
    )

    return {
      superChartCoreRef,
      props
    }
  }
})
</script>

<style scoped>
/* 这里可以添加组件的样式 */
</style>