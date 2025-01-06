import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import { gitRoutes } from './git.js';
import { localRoutes } from './local.js';
import { desktopRoutes } from './desktop.js';
import { googleRoutes } from './google.js';

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/dashboard',
        name: 'MainDashboard',
        component: () => import(/* webpackChunkName: "main-dashboard" */ '../views/MainDashboard.vue')
    },
    {
        path: '/oauth-return',
        name: 'OAuthReturn',
        component: () => import(/* webpackChunkName: "oauth-return" */ '../views/OauthReturn.vue')
    },
    {
        path: '/demo/select',
        name: 'DemoSelect',
        component: () => import(/* webpackChunkName: "demo-select" */ '../views/demo/SelectDemoModel.vue')
    },
    ...desktopRoutes,
    ...gitRoutes,
    ...localRoutes,
    ...googleRoutes,
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;