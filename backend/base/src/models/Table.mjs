import db from '../utils/db';
import toPlural from "../utils/toPlural";
import toSingular from "../utils/toSingular";

const RELATED_TABLES = process.env.RELATED_TABLES && process.env.RELATED_TABLES.split(',');

const processFilter = filter => filter && Object.keys(filter).length ? filter : 1;
const processGroupBy = by => by ? `GROUP BY ${by}` : '';

const getSelectParams = ({ order, limit, offset }) => `${order ? ` ORDER BY ${order[0]} ${order[1] || 'ASC'}`: ''}${limit ? ` LIMIT ${limit}`: ''}${offset ? ` OFFSET ${offset}` : ''}`;

export default class Table {
  constructor(name) {
    this.name = name;
    this.singularName = toSingular(this.name);
  }

  all({ filter, pagination = {} }) {
    return db.query(db.selectFormat(
      'SELECT * FROM ?? WHERE ?' + getSelectParams(pagination),
      [this.name, processFilter(filter)]
    ));
  }

  getByRelation(relation, { filter, pagination = {} }) {
    return db.query(
      db.selectFormat(
        `SELECT a.* FROM ?? a INNER JOIN ?? b ON a.id = b.${this.singularName}_id WHERE ? AND ?` +getSelectParams(pagination),
        [this.name, `${relation.name}_${this.singularName}`, processFilter(filter), { [`${relation.name}_id`]: relation.id }],
      ),
    );
  }

  get(id) {
    return db.queryRow(db.selectFormat('SELECT * FROM ?? WHERE ?', [this.name, typeof id === 'object' ? id : { id }]));
  }

  splitData(data) {
    if (!RELATED_TABLES) return null;

    return RELATED_TABLES.reduce((map, name) => {
      const key = toPlural(name);

      map[name] = data[key];
      delete data[key];

      return map;
    }, {});
  }

  processRelatedTables(id, relations) {
    return relations && Promise.all(
      Object
        .entries(relations)
        .map(([name, ids]) => ids && Promise.all(ids.map(relationId => db.query('REPLACE INTO ?? SET ?', [
          `${this.singularName}_${name}`,
          { [`${this.singularName}_id`]: id, [`${name}_id`]: relationId },
        ])))),
    );
  }

  async add(data) {
    const relations = this.splitData(data);
    const { insertId } = await db.query('INSERT INTO ?? SET ?', [this.name, data]);

    await this.processRelatedTables(insertId, relations);

    return insertId;
  }

  async update(id, data) {
    const relations = this.splitData(data);
    const { changedRows } = await db.query('UPDATE ?? SET ? WHERE ?', [this.name, data, { id }]);

    await this.processRelatedTables(id, relations);

    return changedRows;
  }

  remove(id) {
    return db.query('DELETE FROM ?? WHERE ?', [this.name, { id }]).then(result => result.affectedRows);
  }

  insertRelated(name, id, relatedId) {
    return db.query(
      'REPLACE INTO ?? SET ?',
      [`${name}_${this.singularName}`, { [`${this.singularName}_id`]: id, [`${name}_id`]: relatedId }],
    ).catch(() => null);
  }

  removeRelated(name, id, relatedId) {
    return db.query(
      'DELETE FROM ?? WHERE ?',
      [`${name}_${this.singularName}`, { [`${this.singularName}_id`]: id, [`${name}_id`]: relatedId }],
    ).catch(() => null);
  }

  async aggregate({ aggregation, field, filter, groupBy }) {
    return db.query(`SELECT ${aggregation}(?) ${aggregation} FROM ?? WHERE ? ${processGroupBy(groupBy)}`, [field, this.name, processFilter(filter)]);
  }
}
