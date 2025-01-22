<template>
  <SuperChartCore ref="superChartCoreRef" :width="width" :height="height" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
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
    const options = ref({})
    const theme = defaultTheme

    const getChart = async () => {
      const { chartType, formData, queriesData, height, width } = props
      const chartProps = createChartProps({
        formData,
        queriesData,
        height,
        width,
        theme
      })
      const transformProps =
        await getChartTransformPropsRegistry().getAsPromise(chartType)
      options.value = transformProps(
        JSON.parse(JSON.stringify(chartProps))
      )?.echartOptions
      if (superChartCoreRef.value)
        superChartCoreRef.value?.getChart(options.value)
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
        behaviors = [],
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

    onMounted(() => {
      getChart()
    })
    return {
      superChartCoreRef,
      props,
      options
    }
  }
})
</script>

<style scoped>
/* 这里可以添加组件的样式 */
</style>