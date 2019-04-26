import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            // name: 'index',
            component: () => import('./views/layout/index.vue'),
            children:[
                {path:'/',name:'indexMain',component: () => import('./views/homepage/homepage.vue')},
                {path: '/users',name:'userInfo',component: () => import('./views/main/users/users.vue')},
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/login/login.vue')
        }
    ]
})


// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } else {
        let token = localStorage.getItem('authorization');
        if (token === null || token === '') {
            next('/login');
        } else {
            next();
        }
    }
});


export default router;
