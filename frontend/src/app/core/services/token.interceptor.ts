import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
    const user = localStorage.getItem('CryptoniteUser')
    const token = user ? JSON.parse(user)?.token : ''
    request = request.clone({
        setHeaders: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    });

    return next(request);
};