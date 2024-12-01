// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { map, Observable, tap } from 'rxjs';

// @Injectable()
// export class LoggerInterceptor implements NestInterceptor {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> | Promise<Observable<any>> {
//     // throw new Error('Method not implemented.');
//     console.log('before Route Handler');
//     // return next.handle().pipe(tap(() => console.log('after Route Handler')));
//     return next
//       .handle()
//       .pipe(
//         map((dataFromRouthundler) => {
//           // eslint-disable-next-line @typescript-eslint/no-unused-vars
//           const { password, ...otherData } = dataFromRouthundler;
//           return { ...otherData };
//         }),
//       )
//       .pipe(tap(() => console.log('after Route Handler')));
//   }
// }
