import { createParamDecorator } from '@nestjs/common';

export const Search = createParamDecorator((data, { query }): string | RegExp =>
  query.search ? new RegExp(query.search.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') : '',
);
