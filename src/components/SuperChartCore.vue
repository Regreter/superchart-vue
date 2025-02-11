<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'SuperChartCore',
  props: {
    height: {
      type: String,
      required: true
    },
    width: {
      type: String,
      required: true
    }
  },
  setup() {
    const chartRef = ref<HTMLDivElement | null>(null)
    let chartInstance = null as echarts.ECharts | null
    const getChart = (options: any) => {
      chartInstance = echarts.init(chartRef.value, 'dark')
      chartInstance.setOption(JSON.parse(JSON.stringify(options)))
    }
    return {
      chartRef,
      getChart
    }
  }
})
</script>

<style scoped>
/* 这里可以添加组件的样式 */
</style>