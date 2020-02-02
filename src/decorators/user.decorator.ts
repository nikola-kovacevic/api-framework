import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: string, req) => (data ? req.user && req.user[data] : req.user));
