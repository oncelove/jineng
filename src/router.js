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
                // 首页
                {path:'/',name:'indexMain',component: () => import('./views/homepage/homepage.vue')},
                // 用户管理列表
                {path: '/users',name:'users',component: () => import('./views/main/users/users.vue')},
                // 部门管理列表
                {path: '/dept',name:'list',component: () => import('./views/main/department/list.vue')},
                // 角色管理列表
                {path: '/role',name:'roles',component: () => import('./views/main/roles/roles.vue')},
                // 菜单管理列表
                {path: '/menu',name:'menu',component: () => import('./views/main/menu/menu.vue')},
                // 运营商管理
                {path: '/agent',name:'agent',component: () => import('./views/main/agent/agent.vue')},
                // 配置管理
                {path: '/config',name:'config',component: () => import('./views/main/config/config.vue')},
                // 客户管理
                {path: '/customer',name:'Customer',component: () => import('./views/main/Customer/Customer.vue')},
                // 档案管理
                {path: '/document',name:'archives',component: () => import('./views/main/Customer/archives.vue')},
                {path: '/three',name:'three',component: () => import('./views/main/department/three.vue')},
                // 站点管理
                {path: '/123',name:'stations',component: () => import('./views/main/stations/stations.vue')},
                // {path: 'modules/job/schedule.html1',name:'schedule',component: () => import('./views/main/schedule/schedule.vue')},
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
