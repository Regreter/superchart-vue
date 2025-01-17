<template>
  <SuperChartCore ref="superChartCoreRef" :width="width" :height="height" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import SuperChartCore from './SuperChartCore.vue'
import { defaultTheme } from '../utils/index'
import getChartTransformPropsRegistry from '@superset-ui/core/esm/chart/registries/ChartTransformPropsRegistrySingleton'

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
      options.value = transformProps(chartProps)?.echartOptions
      if (superChartCoreRef.value)
        superChartCoreRef.value?.getChart(options.value)
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