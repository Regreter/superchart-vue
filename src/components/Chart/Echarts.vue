<template>
  <div
    ref="chartRef"
    :style="{ width: width + 'px', height: height + 'px' }"
  ></div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'EchartsWaterfall',
  props: {
    height: {
      type: String,
      required: true
    },
    width: {
      type: String,
      required: true
    },
    echartOptions: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null)
    let chartInstance = null
    const getChart = () => {
      nextTick(() => {
        chartInstance = echarts.init(chartRef.value)
        chartInstance.setOption(JSON.parse(JSON.stringify(props.echartOptions)))
      })
    }
    onMounted(() => {
      getChart()
    })
    return {
      chartRef
    }
  }
})
</script>

<style scoped>
/* 这里可以添加组件的样式 */
</style>