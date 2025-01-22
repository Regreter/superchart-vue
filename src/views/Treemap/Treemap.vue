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
  EchartsTreemapChartPlugin,
  TreemapTransformProps
} from '@superset-ui/plugin-chart-echarts'

new EchartsTreemapChartPlugin().configure({ key: 'echarts-treemap' }).register()

// getChartTransformPropsRegistry().registerValue(
//   'echarts-treemap',
//   TreemapTransformProps
// )
export default defineComponent({
  name: 'Treemap',
  components: {
    SuperChart
  },
  props: {
    showLabels: {
      type: Boolean,
      default: true
    },
    showUpperLabels: {
      type: Boolean,
      default: true
    },
    labelType: {
      type: String,
      default: 'key_value'
    }
  },
  setup(props) {
    const state = reactive({
      chartType: 'echarts-treemap',
      width: 500,
      height: 300,
      data: data,
      formData: {
        colorScheme: 'supersetColors',
        groupby: ['genre'],
        metric: 'count',
        showLabels: props.showLabels,
        showUpperLabels: props.showUpperLabels,
        labelType: props.labelType
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