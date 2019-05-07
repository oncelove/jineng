import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    linkActiveClass:'active',
    routes: [
        {
            path: '/',
            // name: 'index',
            component: () => import('./views/layout/index.vue'),
            children:[
                // 首页
                {path:'/',name:'indexMain',component: () => import('./views/homepage/homepage.vue')},
                // 用户管理列表
                {path: '/sys/users',name:'users',component: () => import('./views/main/users/users.vue')},
                // 部门管理列表
                {path: '/sys/dept',name:'list',component: () => import('./views/main/department/list.vue')},
                // 角色管理列表
                {path: '/sys/role',name:'roles',component: () => import('./views/main/roles/roles.vue')},
                // 菜单管理列表
                {path: '/sys/menu',name:'menu',component: () => import('./views/main/menu/menu.vue')},
                // 运营商管理
                {path: '/sys/agent',name:'agent',component: () => import('./views/main/agent/agent.vue')},
                // 配置管理
                {path: '/sys/config',name:'config',component: () => import('./views/main/config/config.vue')},
                // 客户管理
                {path: '/sys/customer',name:'Customer',component: () => import('./views/main/Customer/Customer.vue')},
                // 档案管理
                { path: '/sys/document', name: 'archives', component: () => import('./views/main/Customer/archives.vue') },
                // 报警列表
                {path: '/deviceserr',name:'archideviceserrves',component: () => import('./views/main/devicesErr/errList.vue')},
                // rpc
                {path: '/rpc',name:'rpc',component: () => import('./views/main/rpc/rpc.vue')},
                // 站点管理
                {path: '/sys/stations',name:'stations',component: () => import('./views/main/stations/stations.vue')},
                //产品管理
                {path: '/sys/products',name:'products',component: () => import('./views/main/products/products.vue')},
                //设备管理
                { path: '/sys/equipments', name: 'equipments', component: () => import('./views/main/equipments/equipments.vue') },
                // 维修记录
                { path: '/sys/123', name: 'record', component: () => import('./views/main/devopt/record.vue') },
                // 维修人员
                { path: '/sys/456', name: 'person', component: () => import('./views/main/devopt/devoptPerson.vue') },
                
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
