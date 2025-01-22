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
import data from './data'
import negativeNumData from './negativeData'
import SuperChart from '../../components/SuperChart.vue'
import { getChartTransformPropsRegistry } from '@superset-ui/core'
import {
  EchartsTimeseriesChartPlugin,
  MixedTimeseriesTransformProps
} from '@superset-ui/plugin-chart-echarts'

new EchartsTimeseriesChartPlugin()
  .configure({ key: 'mixed-timeseries' })
  .register()

getChartTransformPropsRegistry().registerValue(
  'mixed-timeseries',
  MixedTimeseriesTransformProps
)

export default defineComponent({
  name: 'Treemap',
  components: {
    SuperChart
  },
  props: {
    zoomable: {
      type: Boolean,
      default: false
    },
    logAxis: {
      type: Boolean,
      default: false
    },
    yAxisFormat: {
      type: String,
      default: '$,.2f'
    },
    yAxisTitle: {
      type: String,
      default: ''
    },
    yAxisIndexB: {
      type: Number,
      default: 1
    },
    minorSplitLine: {
      type: Boolean,
      default: false
    },
    seriesType: {
      type: String,
      default: 'line'
    },
    stack: {
      type: Boolean,
      default: false
    },
    area: {
      type: Boolean,
      default: false
    },
    markerEnabled: {
      type: Boolean,
      default: false
    },
    markerSize: {
      type: Number,
      default: 6
    },
    opacity: {
      type: Number,
      default: 0.2
    },
    seriesTypeB: {
      type: String,
      default: 'bar'
    },
    stackB: {
      type: Boolean,
      default: false
    },
    areaB: {
      type: Boolean,
      default: false
    },
    markerEnabledB: {
      type: Boolean,
      default: false
    },
    markerSizeB: {
      type: Number,
      default: 6
    },
    opacityB: {
      type: Number,
      default: 0.2
    }
  },
  setup(props) {
    const queriesData = [
      {
        data: data
          .map((row) => ({
            // eslint-disable-next-line no-underscore-dangle
            __timestamp: row.__timestamp,
            Boston: row.Boston
          }))
          .filter((row) => !!row.Boston),
        colnames: ['__timestamp'],
        coltypes: [2]
      },
      {
        data: data
          .map((row) => ({
            // eslint-disable-next-line no-underscore-dangle
            __timestamp: row.__timestamp,
            California: row.California,
            WestTexNewMexico: row.WestTexNewMexico
          }))
          .filter((row) => !!row.California)
      }
    ]
    const {
      zoomable,
      logAxis,
      yAxisFormat,
      yAxisTitle,
      yAxisIndexB,
      minorSplitLine,
      seriesType,
      stack,
      area,
      markerEnabled,
      markerSize,
      opacity,
      seriesTypeB,
      stackB,
      areaB,
      markerEnabledB,
      markerSizeB,
      opacityB
    } = props
    const state = reactive({
      chartType: 'mixed-timeseries',
      width: 500,
      height: 300,
      data: data,
      formData: {
        contributionMode: undefined,
        colorScheme: 'supersetColors',
        zoomable,
        logAxis,
        xAxisTimeFormat: 'smart_date',
        tooltipTimeFormat: 'smart_date',
        yAxisFormat,
        yAxisTitle,
        yAxisIndexB,
        minorSplitLine,
        seriesType,
        stack,
        area,
        markerEnabled,
        markerSize,
        opacity,
        seriesTypeB,
        stackB,
        areaB,
        markerEnabledB,
        markerSizeB,
        opacityB,
        showValue: true
      }
    })
    return {
      ...toRefs(state),
      queriesData
    }
  }
})
</script>

<style scoped>
/* 这里可以添加组件的样式 */
</style>