import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    const user = localStorage.getItem('CryptoniteUsern')
    const token = user ? JSON.parse(user)?.token : ''
    request = request.clone({
        setHeaders: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    });

    return next(request);
};