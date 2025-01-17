<template>
  <Echarts
    ref="echartRef"
    :echartOptions="options"
    :width="width"
    :height="height"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Echarts from './Echarts.vue'
import transformProps from './src/Waterfall/transformProps.ts'
import { defaultTheme } from '../../utils/index.ts'

export default defineComponent({
  name: 'EchartsWaterfall',
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
    Echarts
  },
  setup(props) {
    const options = ref({})
    const theme = defaultTheme
    const config = {
      annotationData: {},
      datasource: {},
      formData: {} as FormData,
      hooks: {},
      ownState: {},
      filterState: {},
      legendState: false,
      initialValues: {},
      queriesData: [],
      behaviors: [],
      displaySettings: {},
      width: 800,
      height: 600,
      appSection: undefined,
      isRefreshing: undefined,
      inputRef: undefined,
      inContextMenu: undefined,
      emitCrossFilters: false,
      theme
    } as any
    const getChart = () => {
      const { chartType, formData, queriesData, height, width } = props
      const chartProps = createChartProps({
        formData,
        queriesData,
        height,
        width,
        theme
      })
      const { echartOptions } = transformProps(chartProps)
      options.value = echartOptions

      console.log(
        1112211,
        'chartType:',
        chartType,
        'chartProps:',
        chartProps,
        'echartOptions:',
        echartOptions
      )
    }
    const createChartProps = (rep: any) => {
      config.formData = rep.formData
      config.queriesData = rep.queriesData
      config.height = rep.height
      config.width = rep.width
      config.rawFormData = rep.formData
      config.rawDatasource = rep.datasource
      return config
    }
    onMounted(() => {
      getChart()
    })
    return {
      options
    }
  }
})
</script>

<style scoped>
/* 这里可以添加组件的样式 */
</style>