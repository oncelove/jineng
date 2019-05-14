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
            // component: () => import('./views/layout/index.vue'),
            component: (resolve) => require(['@/views/layout/index.vue'],resolve),
            children:[
                // 首页
                {path:'/',name:'indexMain',component: (resolve) => require(['@/views/homepage/homepage.vue'],resolve)},
                // 用户管理列表
                {path: '/sys/users',name:'users',component: (resolve) => require(['@/views/main/users/users.vue'],resolve)},
                // 部门管理列表
                {path: '/sys/dept',name:'list',component: (resolve) => require(['@/views/main/department/list.vue'],resolve)},
                // 角色管理列表
                {path: '/sys/role',name:'roles',component: (resolve) => require(['@/views/main/roles/roles.vue'],resolve)},
                // 菜单管理列表
                {path: '/sys/menu',name:'menu',component: (resolve) => require(['@/views/main/menu/menu.vue'],resolve)},
                // 运营商管理
                {path: '/sys/agent',name:'agent',component: (resolve) => require(['@/views/main/agent/agent.vue'],resolve)},
                // 配置管理
                {path: '/sys/config',name:'config',component: (resolve) => require(['@/views/main/config/config.vue'],resolve)},
                // 客户管理
                {path: '/sys/customer',name:'Customer',component: (resolve) => require(['@/views/main/Customer/Customer.vue'],resolve)},
                // 档案管理
                { path: '/sys/document', name: 'archives', component: (resolve) => require(['@/views/main/Customer/archives.vue'],resolve) },
                // 报警列表
                {path: '/deviceserr',name:'archideviceserrves',component: (resolve) => require(['@/views/main/devicesErr/errList.vue'],resolve)},
                // rpc
                {path: '/rpc',name:'rpc',component: (resolve) => require(['@/views/main/rpc/rpc.vue'],resolve)},
                // 站点管理
                {path: '/sys/stations',name:'stations',component: (resolve) => require(['@/views/main/stations/stations.vue'],resolve)},
                //产品管理
                {path: '/sys/products',name:'products',component: (resolve) => require(['@/views/main/products/products.vue'],resolve)},
                //设备管理
                { path: '/sys/equipments', name: 'equipments', component: (resolve) => require(['@/views/main/equipments/equipments.vue'],resolve) },
                // 维修记录
                { path: '/sys/record', name: 'record', component: (resolve) => require(['@/views/main/devopt/record.vue'],resolve) },
                // 维修人员
                { path: '/sys/devoptPerson', name: 'person', component: (resolve) => require(['@/views/main/devopt/devoptPerson.vue'],resolve) },
                // 运维车辆
                { path: '/sys/devoptCar', name: 'car', component: (resolve) => require(['@/views/main/devopt/devoptCar.vue'],resolve) },
                // 巡检计划
                { path: '/sys/plan', name: 'plan', component: (resolve) => require(['@/views/main/devopt/devoptPlan.vue'],resolve) },
                // 维修管理
                { path: '/sys/fault', name: 'fault', component: (resolve) => require(['@/views/main/devopt/devoptFault.vue'],resolve) },
                // 运维类型
                { path: '/sys/devoptType', name: 'devoptType', component: (resolve) => require(['@/views/main/devopt/devoptType.vue'],resolve) },
                { path: '/111', name: '111', component: (resolve) => require(['@/views/main/stations/stationsChart.vue'],resolve) },
                { path: '/123', name: '123', component: (resolve) => require(['@/views/main/onceChart/onceChart.vue'],resolve) },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: (resolve) => require(['./views/login/login.vue'],resolve)
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
