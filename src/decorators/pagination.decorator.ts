import { createParamDecorator } from '@nestjs/common';

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface MongoosePagination {
  skip: number;
  limit: number;
}

const toMongoosePagination = (pagination: PaginationParams): MongoosePagination => ({
  skip: (pagination.page - 1) * pagination.pageSize,
  limit: pagination.pageSize,
});

export const Pagination = createParamDecorator(
  (data, { query }): MongoosePagination =>
    toMongoosePagination({
      page: parseInt(query.page, 10) || 1,
      pageSize: parseInt(query.pageSize, 10) || 10,
    }),
);
