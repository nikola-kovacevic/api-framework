import { createParamDecorator } from '@nestjs/common';

type OrderDirection = 'asc' | 'desc' | 'ascending' | 'descending' | 1 | -1;

interface MongooseSort {
  [key: string]: string | number;
}

interface OrderParams {
  orderBy: string;
  orderDirection: OrderDirection;
}

const toMongooseSort = (orderParams: OrderParams): MongooseSort | undefined =>
  orderParams.orderBy ? { [`${orderParams.orderBy}`]: orderParams.orderDirection || 1 } : undefined;

export const Sort = createParamDecorator((data, { query }) =>
  toMongooseSort({ orderBy: query.orderBy, orderDirection: query.orderDirection }),
);
