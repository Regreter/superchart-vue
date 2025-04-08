<template>
  <div class="grid-stack">
    <div
      gs-w="8"
      gs-h="6"
      class="grid-stack-item"
      v-for="(item, index) in items"
      :key="index"
    >
      <div class="grid-stack-item-content">
        <Filters ref="filtersRef" :filterItems="filterItems" />
        <a-button size="small" @click="handleQuery(item, index)" type="primary"
          >查询</a-button
        >
        <!-- <div v-for="(filter, index) in filterItems" :key="index">
          <SuperChartWrapper
            v-if="filter.chartType"
            :chartType="filter.chartType"
            :width="filter.width"
            :height="filter.height"
            :queriesData="filter.queriesData"
            :formData="filter.formData"
          />
        </div> -->
        <SuperChartWrapper
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

<script lang="tsx">
import { defineComponent, onMounted, reactive, toRefs, ref } from 'vue'
import getChartDataRequest from '../../utils/chartAction'
import { Filter, SupersetClient } from '@superset-ui/core'
import { GridStack } from 'gridstack'
import * as echarts from 'echarts'
import SuperChartWrapper from './SuperChartWrapper.vue'
import { getFormData } from '../../utils/nativeFilters'
import Filters from '../../components/Filters.vue'
// import { AntdSelectFilterPlugin } from '@superset-ui/plugin-filter-antd';
// import { SelectFilterPlugin } from '../../filters/components';

// new AntdSelectFilterPlugin().configure({ key: 'plugin-filter-select' }).register();
// import {
//   TimeFilterPlugin,
//   SelectFilterPlugin
// } from '../../components/filters/components'
// new SelectFilterPlugin().configure({ key: 'filter_select' }).register();
export interface Owner {
  first_name?: string
  id: number
  last_name?: string
  full_name?: string
}
export interface Role {
  id: number
  name: string
}
export interface Dashboard {
  id: number
  slug?: string | null
  url: string
  dashboard_title: string
  thumbnail_url: string
  published: boolean
  css?: string | null
  json_metadata?: string | null
  position_json?: string | null
  changed_by_name: string
  changed_by: Owner
  changed_on: string
  charts: string[] // just chart names, unfortunately...
  owners: Owner[]
  roles: Role[]
}

export default defineComponent({
  name: 'Char',
  components: {
    Filters,
    SuperChartWrapper
  },
  setup() {
    const filtersRef = ref<InstanceType<typeof Filters>[]>([])
    const state = reactive({
      chartType: '',
      width: 500,
      height: 400,
      queriesData: [] as any,
      formData: {},
      filters: [] as Filter[],
      filterItems: [] as any,
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
      // { x: 0, y: 0, w: 6, h: 4 },
      // { x: 0, y: 0, w: 6, h: 4 }
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
      // 调用/api/v1/dashboard/1接口获取filter配置
      const useApiV1Resource = await fetch('/api/v1/dashboard/1')
      const dashboard = await useApiV1Resource.json()
      const { native_filter_configuration } = JSON.parse(
        dashboard.result?.json_metadata
      )
      state.filters = native_filter_configuration.filter((e: any) => e.type !== 'DIVIDER')

      state.filterItems = state.filters.map(async (filter) => {
        const { name, targets, filterType, adhoc_filters, time_range } = filter;
        const [ target ] = targets;
        const { datasetId,column = {} }: Partial<{ datasetId: number; column: { name?: string } }> = target;
        const dependencies = {};
        const { name: groupby } = column;
        const dashboardId = 1;
        const newFormData = getFormData({
          ...filter,
          datasetId,
          dependencies,
          groupby,
          adhoc_filters,
          time_range,
          dashboardId,
        });
        const filterResponse = await getChartDataRequest({ formData: newFormData });
        const { json: { result } } = filterResponse;
        return {
          formData: newFormData,
          queriesData: result,
          chartType: filterType,
          width: 100,
          height: 32,
          name,
        }
      })
      state.filterItems = await Promise.all(state.filterItems);
      console.log('filterItems:', state.filterItems);

      // 调用/api/v1/dashboard/1/charts接口获取formData
      const response = await SupersetClient.get({
        endpoint: '/api/v1/dashboard/1/charts'
      })
      const {
        json: { result }
      } = response
      console.log('result:', result);
      
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
    }

    const handleQuery = async (item: any, index: number) => {
      item.formData.extra_form_data = {
        filters: filtersRef.value[index].filters
      }
      const chartDataRequest = await getChartDataRequest({
        formData: item.formData,
        dashboardId: 1
      })
      const {
        json: {
          result: [{ data }]
        }
      } = chartDataRequest
      items[index].queriesData = [{ data }]
    }

    onMounted(() => {
      // 初始化gridstack
      initGrid()
      // 获取token及配置SupersetClient
      setSupersetClient()
    })
    return {
      filtersRef,
      grid,
      items,
      ...toRefs(state),
      handleQuery
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