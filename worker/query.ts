import { createQuery } from '@workaholic/core';
import { setupQuery as setupListQuery } from '@workaholic/core/dist/plugins/plugin-list';
import { setupQuery as setupTagQuery } from '../workaholic/tags';
import { setupQuery as setupDataQuery } from '../workaholic/data';

const query = createQuery(Content, [
  { namespace: 'data', handlerFactory: setupDataQuery() },
  { namespace: 'list', handlerFactory: setupListQuery() },
  { namespace: 'tags', handlerFactory: setupTagQuery() },
]);

export default query;
