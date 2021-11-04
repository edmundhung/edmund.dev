import { createQuery } from '@workaholic/core';
import { setupQuery as setupListQuery } from '@workaholic/core/dist/plugins/plugin-list';
import { setupQuery as setupTagQuery } from '../workaholic/tags';

const query = createQuery(Content, [setupListQuery(), setupTagQuery()]);

export default query;
