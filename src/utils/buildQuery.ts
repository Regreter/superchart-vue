/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  BuildQuery,
  buildQueryContext,
  GenericDataType,
  getColumnLabel,
  isPhysicalColumn,
  QueryFormData,
  QueryObject,
  QueryObjectFilterClause,
} from '@superset-ui/core';
import { DEFAULT_FORM_DATA, PluginFilterSelectQueryFormData } from '../types/buildQueryTypes';

/**
 * The buildQuery function is used to create an instance of QueryContext that's
 * sent to the chart data endpoint. In addition to containing information of which
 * datasource to use, it specifies the type (e.g. full payload, samples, query) and
 * format (e.g. CSV or JSON) of the result and whether or not to force refresh the data from
 * the datasource as opposed to using a cached copy of the data, if available.
 *
 * More importantly though, QueryContext contains a property `queries`, which is an array of
 * QueryObjects specifying individual data requests to be made. A QueryObject specifies which
 * columns, metrics and filters, among others, to use during the query. Usually it will be enough
 * to specify just one query based on the baseQueryObject, but for some more advanced use cases
 * it is possible to define post processing operations in the QueryObject, or multiple queries
 * if a viz needs multiple different result sets.
 */
export function rangeBuildQuery(formData: QueryFormData) {
  const { groupby } = formData;
  const [column = ''] = groupby || [];
  // @ts-ignore (need update interface Column )
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      columns: [],
      metrics: [
        {
          aggregate: 'MIN',
          column: {
            column_name: column,
            id: 1,
            type_generic: GenericDataType.Numeric,
          },
          expressionType: 'SIMPLE',
          hasCustomLabel: true,
          label: 'min',
        },
        {
          aggregate: 'MAX',
          column: {
            column_name: column,
            id: 2,
            type_generic: GenericDataType.Numeric,
          },
          expressionType: 'SIMPLE',
          hasCustomLabel: true,
          label: 'max',
        },
      ],
    },
  ]);
}

export const selectBuildQuery: BuildQuery<PluginFilterSelectQueryFormData> = (
  formData: PluginFilterSelectQueryFormData,
  options,
) => {
  const { search, coltypeMap } = options?.ownState || {};
  const { sortAscending, sortMetric } = { ...DEFAULT_FORM_DATA, ...formData };
  return buildQueryContext(formData, baseQueryObject => {
    const { columns = [], filters = [] } = baseQueryObject;
    const extraFilters: QueryObjectFilterClause[] = [];
    if (search) {
      columns.filter(isPhysicalColumn).forEach(column => {
        const label = getColumnLabel(column);
        if (
          coltypeMap[label] === GenericDataType.String ||
          (coltypeMap[label] === GenericDataType.Numeric &&
            !Number.isNaN(Number(search)))
        ) {
          extraFilters.push({
            col: column,
            op: 'ILIKE',
            val: `%${search}%`,
          });
        }
      });
    }

    const sortColumns = sortMetric ? [sortMetric] : columns;
    const query: QueryObject[] = [
      {
        ...baseQueryObject,
        columns,
        metrics: sortMetric ? [sortMetric] : [],
        filters: filters.concat(extraFilters),
        orderby:
          sortMetric || sortAscending !== undefined
            ? sortColumns.map(column => [column, !!sortAscending])
            : [],
      },
    ];
    return query;
  });
};