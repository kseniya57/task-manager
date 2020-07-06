import Router from 'koa-router';

const userField = process.env.USER_FIELD;

class Controller {
  constructor() {
    this.initializeRouter();
  }

  initializeRouter() {
    const router = new Router();

    router.post('/', this.all); // post for filters
    router.get('/:id', this.get);
    router.post('/add', this.add);
    router.post('/aggregate', this.aggregate);
    router.put('/:id', this.update);
    router.delete('/:id', this.remove);
    this.router = router;
  }

  routes() {
    return this.router.routes();
  }

  addRoute(method, path, handler) {
    this.router[method](path, handler);
  }

  async all(ctx) {
    const { relation } = ctx.params;

    ctx.body = await (relation
      ? ctx.table.getByRelation(relation, ctx.params)
      : ctx.table.all(ctx.params)
    );
  }

  async get(ctx) {
    ctx.body = await ctx.table.get(ctx.params.id);
  }

  async add(ctx) {
    if (userField) {
      ctx.params.data[userField] = ctx.params.userId;
    }

    const { data, object } = ctx.params;

    const id = await ctx.table.add(data);

    if (object) {
      ctx.table.insertRelated(object.name, id, object.id);
    }

    ctx.body = await ctx.table.get(id);
  }

  async update(ctx) {
    const { id, data } = ctx.params;
    const oldData = await ctx.table.get(id);
    await ctx.table.update(id, data);
    ctx.body = { data: await ctx.table.get(id), oldData };
  }

  async remove(ctx) {
    const { object, id } = ctx.params;
    const countOfDeletedRows = await ctx.table.remove(id);

    if (object) {
      ctx.table.removeRelated(object.name, id, object.id);
    }

    ctx.body = countOfDeletedRows !== 0;
  }

  async aggregate(ctx) {
    ctx.body = await ctx.table.aggregate(ctx.params);

  }
}

export default new Controller();
