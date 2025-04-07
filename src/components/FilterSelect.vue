<template>
  <div>
    <label>{{ name }}:</label>
    <a-select
      size="small"
      mode="multiple"
      style="width: 300px"
      v-model:value="selectValue"
    >
      <a-select-option
        v-for="option in queriesData.data"
        :key="option[queriesData.colnames[0]]"
        :value="option[queriesData.colnames[0]]"
        >{{ option[queriesData.colnames[0]] }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, defineExpose, computed } from 'vue'

export default defineComponent({
  props: {
    chartType: String,
    width: [String, Number],
    height: [String, Number],
    queriesData: Array as any,
    formData: {
      type: Object,
      required: true
    },
    name: String
  },
  setup(props) {
    const selectValue = ref([])

    const filter = computed(() => {
      return {
        col: props.queriesData.colnames[0],
        op: 'IN',
        val: selectValue.value
      }
    })
    defineExpose({
      filter
    })

    return {
      selectValue,
      filter
    }
  }
})
</script>