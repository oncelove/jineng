import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('./views/layout/index.vue'),
            children:[
                {path:'/',name:'indexMain',component: () => import('./views/homepage/homepage.vue')},
                {path: '/modules/sys/user.html',name:'userInfo',component: () => import('./views/layout/content/main.vue')}
            ]
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
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
