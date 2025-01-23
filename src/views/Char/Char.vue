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
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import SuperChart from '../../components/SuperChart.vue'
import {
  EchartsAreaChartPlugin,
  EchartsTimeseriesBarChartPlugin,
  EchartsTimeseriesLineChartPlugin,
  EchartsTimeseriesScatterChartPlugin,
  EchartsWaterfallChartPlugin
} from '@superset-ui/plugin-chart-echarts'
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../../utils/content'
import SupersetClient from '../../utils/SupersetClient'
import getChartDataRequest from '../../utils/chartAction'

new EchartsTimeseriesBarChartPlugin()
  .configure({ key: 'echarts_timeseries_bar' })
  .register()
new EchartsTimeseriesLineChartPlugin()
  .configure({ key: 'echarts_timeseries_line' })
  .register()
new EchartsTimeseriesScatterChartPlugin()
  .configure({ key: 'echarts_timeseries_scatter' })
  .register()
new EchartsAreaChartPlugin().configure({ key: 'echarts_area' }).register()
new EchartsWaterfallChartPlugin().configure({ key: 'waterfall' }).register()

export default defineComponent({
  name: 'echarts-timeseries',
  components: {
    SuperChart
  },
  props: {
    width: {
      type: Number,
      default: DEFAULT_WIDTH
    },
    height: {
      type: Number,
      default: DEFAULT_HEIGHT
    }
  },
  setup(props) {
    const { width, height } = props
    const state = reactive({
      chartType: '',
      width,
      height,
      queriesData: [] as any,
      formData: {}
    })

    const fetchData = async () => {
      const response = await SupersetClient.get({
        endpoint: '/api/v1/dashboard/1/charts'
      })
      const {
        json: {
          result: [{ form_data }]
        }
      } = response
      const { viz_type } = form_data
      state.chartType = viz_type
      state.formData = form_data
      const chartDataRequest = await getChartDataRequest({
        formData: form_data
      })
      const {
        json: {
          result: [{ data }]
        }
      } = chartDataRequest
      state.queriesData = [{ data }]
      console.log(
        'viz_type:',
        viz_type,
        ';form_data:',
        form_data,
        ';data:',
        data
      )
    }

    onMounted(() => {
      fetchData()
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