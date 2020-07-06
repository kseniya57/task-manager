import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const twoDigits = number => (number < 10 ? '0' : '') + number;

// eslint-disable-next-line no-extend-native
Date.prototype.toMysqlFormat = function () {
  return `${this.getUTCFullYear()}-${twoDigits(1 + this.getUTCMonth())}-${twoDigits(this.getUTCDate())} ${twoDigits(this.getUTCHours())}:${twoDigits(this.getUTCMinutes())}:${twoDigits(this.getUTCSeconds())}`;
};

export default new GraphQLScalarType({
  name: 'Date',
  description: 'Date type',
  parseValue(value) {
    return (new Date(value)).toMysqlFormat();
  },
  serialize(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10);
    }

    return null;
  },
});
