/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { identity, pickBy } from 'lodash';

import type { Filter, FilterMeta } from '..';

type FilterOperator = Pick<FilterMeta, 'type' | 'negate'>;

export const updateFilter = (
  filter: Filter,
  field?: string,
  operator?: FilterOperator,
  params?: Filter['meta']['params']
) => {
  if (!field || !operator) {
    return updateField(filter, field);
  }

  if (operator.type === 'exists') {
    return updateWithExistsOperator(filter, operator);
  }
  if (operator.type === 'range') {
    return updateWithRangeOperator(filter, operator, params, field);
  }
  if (Array.isArray(params)) {
    return updateWithIsOneOfOperator(filter, operator, params);
  }

  return updateWithIsOperator(filter, operator, params);
};

function updateField(filter: Filter, field?: string) {
  return {
    ...filter,
    meta: {
      ...filter.meta,
      key: field,
      // @todo: check why we need to pass "key" and "field" with the same data
      field,
      params: { query: undefined },
      value: undefined,
      type: undefined,
    },
    query: undefined,
  };
}

function updateWithExistsOperator(filter: Filter, operator?: FilterOperator) {
  return {
    ...filter,
    meta: {
      ...filter.meta,
      negate: operator?.negate,
      type: operator?.type,
      params: undefined,
      value: 'exists',
    },
    query: { exists: { field: filter.meta.key } },
  };
}

function updateWithIsOperator(
  filter: Filter,
  operator?: FilterOperator,
  params?: Filter['meta']['params']
) {
  return {
    ...filter,
    meta: {
      ...filter.meta,
      negate: operator?.negate,
      type: operator?.type,
      params: { ...filter.meta.params, query: params },
    },
    query: { match_phrase: { [filter.meta.key!]: params ?? '' } },
  };
}

function updateWithRangeOperator(
  filter: Filter,
  operator: FilterOperator,
  rawParams: Array<Filter['meta']['params']>,
  field: string
) {
  const params = {
    ...filter.meta.params,
    ...pickBy(rawParams, identity),
  };

  params.gte = params.from;
  params.lt = params.to;

  const updatedFilter = {
    ...filter,
    meta: {
      ...filter.meta,
      negate: operator?.negate,
      type: operator?.type,
      params,
    },
    query: {
      range: {
        [field]: params,
      },
    },
  };

  return updatedFilter;
}

function updateWithIsOneOfOperator(
  filter: Filter,
  operator?: FilterOperator,
  params?: Array<Filter['meta']['params']>
) {
  return {
    ...filter,
    meta: {
      ...filter.meta,
      negate: operator?.negate,
      type: operator?.type,
      params,
    },
    query: {
      bool: {
        minimum_should_match: 1,
        ...filter!.query?.should,
        should: params?.map((param) => ({ match_phrase: { [filter.meta.key!]: param } })),
      },
    },
  };
}
