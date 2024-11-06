import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTpayloadType } from 'src/utils/types';
import { CURRENT_USER_KEY } from 'src/utils/constants';

// current user parameter Decorator
export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload: JWTpayloadType = request[CURRENT_USER_KEY];
    return payload;
  },
);
