import { buildQueryContext, getChartBuildQueryRegistry, getChartMetadataRegistry, SupersetClient } from "@superset-ui/core";

import URI from "urijs";

export default async function getChartDataRequest({
  formData,
  dashboardId = undefined as  undefined | number,
  setDataMask = () => {},
  resultFormat = 'json',
  resultType = 'full',
  force = false,
  requestParams = {},
  ownState = {},
}) {
  let querySettings = {
    ...requestParams,
  };
  const [ parseMethod ] = getQuerySettings(formData);
  return v1ChartDataRequest(
    formData,
    dashboardId,
    resultFormat,
    resultType,
    force,
    querySettings,
    setDataMask,
    ownState,
    parseMethod,
  );
}

export function getChartDataUri({ path, qs, allowDomainSharding = false }) {
  // The search params from the window.locxation are carried through,
  // but can be specified with curUrl (used for unit tests to spoof
  // the window.location).
  let uri = new URI({
    protocol: 'http',
    hostname: window.location.hostname,
    port: window.location.port ? window.location.port : '',
    path,
  });
  if (qs) {
    uri = uri.search(qs);
  }
  return uri;
}

const v1ChartDataRequest = async (
  formData,
  dashboardId,
  resultFormat,
  resultType,
  force,
  requestParams,
  setDataMask,
  ownState,
  parseMethod,
) => {
  const payload = buildV1ChartDataPayload({
    formData,
    resultType,
    resultFormat,
    force,
    setDataMask,
    ownState,
  });
  // The dashboard id is added to query params for tracking purposes
  const { slice_id: sliceId } = formData;

  const qs = {} as any;
  if (sliceId !== undefined) qs.form_data = `{"slice_id":${sliceId}}`;
  if (dashboardId !== undefined) qs.dashboard_id = dashboardId;
  if (force) qs.force = force;

  const url = getChartDataUri({
    path: '/api/v1/chart/data',
    qs,
  }).toString();

  const querySettings = {
    ...requestParams,
    url,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    parseMethod,
  };
  return SupersetClient.post(querySettings);
};

const getQuerySettings = formData => {
  const vizMetadata = getChartMetadataRegistry().get(formData.viz_type);
  return [
    vizMetadata?.parseMethod ?? 'json-bigint',
  ];
};

const buildV1ChartDataPayload = ({
  formData,
  force,
  resultFormat,
  resultType,
  setDataMask,
  ownState,
}) => {
  const buildQuery =
    getChartBuildQueryRegistry().get(formData.viz_type) ??
    (buildQueryformData =>
      buildQueryContext(buildQueryformData, baseQueryObject => [
        {
          ...baseQueryObject,
        },
      ])) as any;
  return buildQuery(
    {
      ...formData,
      force,
      result_format: resultFormat,
      result_type: resultType,
    },
    {
      ownState,
      hooks: {
        setDataMask,
      },
    },
  );
};