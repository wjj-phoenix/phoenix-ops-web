import { RouteRecordRaw } from 'vue-router';

export const URL_HOME: string = '/home';

// 登录页地址（默认）
export const URL_LOGIN: string = '/login';

export const URL_401: string = '/401';

export const URL_404: string = '/404';

export const LAYOUT_ROUTE_NAME: string = 'layout';

// 路由白名单地址（本地存在的路由 staticRouter.ts 中）
export const ROUTER_WHITE_LIST: string[] = [URL_404, URL_401, '/oauth2/callback'];

// 静态路由
export const staticRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: URL_HOME,
    },
    {
        path: URL_LOGIN,
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
        },
    }
];

// 错误页面路由
export const errorRoutes: Array<RouteRecordRaw> = [
    
];
