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
import {
  EchartsAreaChartPlugin,
  TimeseriesTransformProps
} from '@superset-ui/plugin-chart-echarts'
import { config } from './config'
new EchartsAreaChartPlugin().configure({ key: 'echarts_area' }).register()

getChartTransformPropsRegistry().registerValue(
  'echarts_area',
  TimeseriesTransformProps
)

export default defineComponent({
  name: 'AreaSeries',
  components: {
    SuperChart
  },
  setup() {
    const { args } = config
    const {
      forecastEnabled,
      seriesType,
      show_extra_controls,
      logAxis,
      stack,
      showValue,
      onlyTotal,
      percentageThreshold,
      markerEnabled,
      markerSize,
      minorSplitLine,
      opacity,
      zoomable
    } = args
    const queryData = data
      .map((row) =>
        forecastEnabled
          ? row
          : {
              __timestamp: row.__timestamp,
              Boston: row.Boston,
              California: row.California,
              WestTexNewMexico: row.WestTexNewMexico
            }
      )
      .filter((row) => forecastEnabled || !!row.Boston)
    const state = reactive({
      chartType: 'echarts_area',
      width: 500,
      height: 300,
      data: queryData,
      formData: {
        area: true,
        contributionMode: undefined,
        forecastEnabled,
        colorScheme: 'supersetColors',
        seriesType,
        show_extra_controls,
        logAxis,
        yAxisFormat: 'SMART_NUMBER',
        stack,
        showValue,
        onlyTotal,
        percentageThreshold,
        markerEnabled,
        markerSize,
        minorSplitLine,
        opacity,
        zoomable
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