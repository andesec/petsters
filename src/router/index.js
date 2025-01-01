import { createRouter, createWebHistory } from 'vue-router';
import Battle from '../views/Battle.vue';
import Maps from '../views/Maps.vue';
import Profile from '../views/Profile.vue';
import Gyms from '../views/Gyms.vue';
import Login from '../views/Login.vue';
import config from '../config';

const routes = [
    { path: '/login', name: 'Login', component: Login },
    {
        path: '/',
        name: 'Home',
        redirect: '/battle',
        meta: { requiresAuth: true },
        children: [
            { path: 'battle', name: 'Battle', component: Battle, },
            { path: 'maps', name: 'Maps', component: Maps },
            { path: 'profile', name: 'Profile', component: Profile },
            { path: 'gyms', name: 'Gyms', component: Gyms },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _, next) => {
    if (config.disableLogin || localStorage.getItem('token')) {
        next();
    } else if (to.meta.requiresAuth) {
        next('/login');
    } else {
        next();
    }
});

// Navigation guard for authentication
// router.beforeEach((to, _, next) => {
//     const isAuthenticated = localStorage.getItem('token');
//     if (to.meta.requiresAuth && !isAuthenticated) {
//         next('/login');
//     } else {
//         next();
//     }
// });

export default router;