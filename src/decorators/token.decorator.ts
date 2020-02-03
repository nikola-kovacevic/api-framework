import { createParamDecorator } from '@nestjs/common';

export const Token = createParamDecorator((data: string, req): string => req.get('authorization') || '');
