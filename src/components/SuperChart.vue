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

export default defineComponent({
  name: 'SuperChart',
  props: {
    chartType: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
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
      console.log('echartOptions:', echartOptions)

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