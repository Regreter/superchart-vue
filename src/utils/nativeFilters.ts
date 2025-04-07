import { AdhocFilter, DEFAULT_D3_FORMAT, DEFAULT_D3_TIME_FORMAT, Filter, QueryFormData } from "@superset-ui/core";
import extractUrlParams from "./extractUrlParams";
import { BootstrapData, CommonBootstrapData } from "src/types/bootstrapTypes";

export const DEFAULT_COMMON_BOOTSTRAP_DATA: CommonBootstrapData = {
  flash_messages: [],
  conf: {},
  locale: 'en',
  feature_flags: {},
  language_pack: {
    domain: '',
    locale_data: {
      superset: {
        '': {
          domain: 'superset',
          lang: 'en',
          plural_forms: '',
        },
      },
    },
  },
  extra_categorical_color_schemes: [],
  extra_sequential_color_schemes: [],
  theme_overrides: {},
  menu_data: {
    menu: [],
    brand: {
      path: '',
      icon: '',
      alt: '',
      tooltip: '',
      text: '',
    },
    navbar_right: {
      show_watermark: true,
      languages: {},
      show_language_picker: true,
      user_is_anonymous: false,
      user_info_url: '',
      user_login_url: '',
      user_logout_url: '',
      locale: '',
    },
    settings: [],
    environment_tag: {
      text: '',
      color: '',
    },
  },
  d3_format: DEFAULT_D3_FORMAT,
  d3_time_format: DEFAULT_D3_TIME_FORMAT,
};

export const DEFAULT_BOOTSTRAP_DATA: BootstrapData = {
  common: DEFAULT_COMMON_BOOTSTRAP_DATA,
};

export default function getBootstrapData(): BootstrapData {
  const appContainer = document.getElementById('app');
  const dataBootstrap = appContainer?.getAttribute('data-bootstrap');
  return dataBootstrap ? JSON.parse(dataBootstrap) : DEFAULT_BOOTSTRAP_DATA;
}

const getDefaultRowLimit = (): number => {
  const bootstrapData = getBootstrapData();
  const nativeFilterDefaultRowLimit =
    bootstrapData?.common?.conf?.NATIVE_FILTER_DEFAULT_ROW_LIMIT;
  return nativeFilterDefaultRowLimit || 1000;
};

export const getFormData = ({
  datasetId,
  dependencies = {},
  groupby,
  defaultDataMask,
  controlValues,
  filterType,
  sortMetric,
  adhoc_filters,
  time_range,
  granularity_sqla,
  type,
  dashboardId,
  id,
}: Partial<Filter> & {
  dashboardId: number;
  datasetId?: number;
  dependencies?: object;
  groupby?: string;
  adhoc_filters?: AdhocFilter[];
  time_range?: string;
}): Partial<QueryFormData> => {
  const otherProps: {
    datasource?: string;
    groupby?: string[];
    sortMetric?: string;
  } = {};
  if (datasetId) {
    otherProps.datasource = `${datasetId}__table`;
  }
  if (groupby) {
    otherProps.groupby = [groupby];
  }
  if (sortMetric) {
    otherProps.sortMetric = sortMetric;
  }
  return {
    ...controlValues,
    ...otherProps,
    adhoc_filters: adhoc_filters ?? [],
    extra_filters: [],
    extra_form_data: dependencies,
    granularity_sqla,
    metrics: ['count'],
    row_limit: getDefaultRowLimit(),
    showSearch: true,
    defaultValue: defaultDataMask?.filterState?.value,
    time_range,
    url_params: extractUrlParams('regular'),
    inView: true,
    viz_type: filterType,
    type,
    dashboardId,
    native_filter_id: id,
  };
};