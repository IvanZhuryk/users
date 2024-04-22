import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const myToken = localStorage.getItem('access_token');
  const cloneReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${myToken}`,
    },
  });
  return next(cloneReq);
};
