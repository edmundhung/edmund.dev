import { createQuery } from '@workaholic/core';
import { setupQuery as setupListQuery } from '@workaholic/core/dist/plugins/plugin-list';

const query = createQuery(Content, [setupListQuery()]);

export default query;
