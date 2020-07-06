import { controller } from 'base';

import getEventData from '../utils/getEventData';

controller.addRoute('post', '/:name', async ctx => {
  const { userId, name, type, object = {}, data, oldData } = ctx.params;

  const eventData = await getEventData(type, name, data, oldData); // TODO: type,
  ctx.body = await Promise.all((Array.isArray(eventData) ? eventData : [eventData]).map(async ({ content, type }) => {
    const insertId = await ctx.table.add({
      user_id: userId,
      content,
      owner_id: object.id,
      owner_type: object.name,
      object_id: data.id,
      object: name,
      type,
      // TODO: TIME
      // time: type === 'add' && data.created_at || (type === 'update' && data.updated_at) || null
    });
    return ctx.table.get(insertId);
  }))
});
