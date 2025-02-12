<template>
  <div class="grid-stack">
    <div
      gs-w="6"
      gs-h="4"
      class="grid-stack-item"
      v-for="(item, index) in items"
      :key="index"
    >
      <div class="grid-stack-item-content">
        <SuperChart
          :id="'chart-' + index"
          :chartType="item.chartType"
          :width="width"
          :height="height"
          :queriesData="item.queriesData"
          :formData="item.formData"
        />
      </div>
    </div>
  </div>
</template> 

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref } from 'vue'
import SuperChart from '../../components/SuperChart.vue'
import getChartDataRequest from '../../utils/chartAction'
import { SupersetClient } from '@superset-ui/core'
import { GridStack } from 'gridstack'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'Char',
  components: {
    SuperChart
  },
  setup() {
    const state = reactive({
      chartType: '',
      width: '100%',
      height: '100%',
      queriesData: [] as any,
      formData: {}
    })

    // 获取token及配置SupersetClient
    const setSupersetClient = async () => {
      document.cookie =
        'session=.eJwtjktqAzEQBe-idRb9k1ryZQapPyTExDBjr4LvHi2yKl5BwfstR55xfZbb83zFRzm-vNwKEiaOlBwzBdZqmI7UVgyrm1575eF90xtBKi-oDMGwGg-1yKxTtQJ4NxoZmM2xB21jHWnO2W0RuiVzXQLJqF19ClMuFS_7yOuK8__NnnadeTwf3_GzhaRSJwYITcMWpjKEZXr1MUUd6wocYLu7P2zeYzc7fP8BWexDPQ.Z6v1lQ.Hv_uBNRzHkhzREBKMUJwrO8s2Fk'
      const response = await fetch('/api/v1/security/csrf_token/')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      SupersetClient.configure({
        baseUrl: 'http://localhost:5173',
        mode: 'cors',
        credentials: 'include',
        csrfToken: data?.result
      })
        .init()
        .catch((error) =>
          console.error('Error initializing SupersetClient:', error)
        )

      // 获取图表信息及数据
      fetchData()
    }

    // 图表拖拽及缩放功能
    const grid = ref(null as GridStack | null)
    const items = reactive([
      { x: 0, y: 0, w: 6, h: 4 },
      { x: 0, y: 0, w: 6, h: 4 },
      { x: 0, y: 0, w: 6, h: 4 }
    ]) as any
    const initGrid = () => {
      grid.value = GridStack.init({
        float: true,
        margin: 5,
        draggable: { handle: '.grid-stack-item-content' }
      })
      grid.value?.on('resizestop', (event, el) => {
        const chartId = el.querySelector('.grid-stack-item-content > div')?.id
        if (chartId) {
          const element = document.getElementById(chartId)
          if (element) {
            const chart = echarts.getInstanceByDom(element)
            chart?.resize()
          }
        }
      })
    }

    // 获取图表信息及数据
    const fetchData = async () => {
      // 调用/api/v1/dashboard/1/charts接口获取formData
      const response = await SupersetClient.get({
        endpoint: '/api/v1/dashboard/1/charts'
      })
      const {
        json: { result }
      } = response
      for (let i = 0; i < result.length; i++) {
        const item = result[i]
        const { viz_type } = item.form_data
        // 调用/api/v1/chart/data?form_data接口获取queriesData
        const chartDataRequest = await getChartDataRequest({
          formData: item.form_data,
          dashboardId: 1
        })
        const {
          json: {
            result: [{ data }]
          }
        } = chartDataRequest
        items[i] = {
          x: 0,
          y: 0,
          w: 6,
          h: 4,
          chartType: viz_type,
          formData: item.form_data,
          queriesData: [{ data }]
        }
      }
      console.log('items:', items)
    }
    onMounted(() => {
      // 初始化gridstack
      initGrid()
      // 获取token及配置SupersetClient
      setSupersetClient()
    })
    return {
      grid,
      items,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>
.grid-stack {
  width: 100%;
  height: 100%;
}
</style>