export const config = {
  title: 'Chart Plugins/plugin-chart-echarts',
  parameters: {
    initialSize: { width: 500, height: 300 },
  },
  args: {
    forecastEnabled: true,
    seriesType: 'line',
    show_extra_controls: false,
    logAxis: false,
    stack: false,
    showValue: false,
    onlyTotal: false,
    percentageThreshold: 0,
    markerEnabled: false,
    markerSize: 6,
    minorSplitLine: false,
    opacity: 0.2,
    zoomable: false,
  },
  argTypes: {
    forecastEnabled: {
      control: 'boolean',
      description: 'Extra Forecast',
      defaultValue: false,
    },
    seriesType: {
      control: 'select',
      description: 'Line type',
      options: ['line', 'scatter', 'smooth', 'bar', 'start', 'middle', 'end'],
    },
    show_extra_controls: {
      control: 'boolean',
      description: 'Extra Controls',
      defaultValue: false,
    },
    logAxis: {
      control: 'boolean',
      description: 'Log axis',
      defaultValue: false,
    },
    stack: {
      control: 'boolean',
      defaultValue: false,
    },
    showValue: {
      control: 'boolean',
      description: 'Show Values',
      defaultValue: false,
    },
    onlyTotal: {
      control: 'boolean',
      description: 'Only Total',
      defaultValue: false,
    },
    percentageThreshold: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Percentage Threshold',
      defaultValue: 0,
    },
    markerEnabled: {
      control: 'boolean',
      description: 'Enable markers',
      defaultValue: false,
    },
    markerSize: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Marker Size',
      defaultValue: 6,
    },
    minorSplitLine: {
      control: 'boolean',
      description: 'Minor splitline',
      defaultValue: false,
    },
    opacity: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'Opacity',
      defaultValue: 0.2,
    },
    zoomable: {
      control: 'boolean',
      description: 'Zoomable',
      defaultValue: false,
    },
  },
};