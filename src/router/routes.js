const lazyload = (name) => (resolve) => require([`@/pages/${name}`], resolve)
import layout from '@/pages/layout'

const routerMap = [{
        path: '/',
        redirect: '/login',
        component: lazyload('user/index'),
        children: [{
            path: 'login',
            name: 'login',
            component: lazyload('user/login'),
            meta: {
                title: '登录'
            }
        }, {
            path: 'forget',
            name: 'forget',
            component: lazyload('user/forget'),
            meta: {
                title: '忘记密码'
            }
        }]
    }]

    const sideRoutes = [
        {
            path: '/statistic',
            name: 'user',
            meta: {
                title: '青说统计',
                icon: 'ts-shezhi'
            },
            noDropdown: true,
            component: layout,
            children: [{
                path: 'index',
                alias: '',
                meta: { title: '青说统计' },
                component: lazyload('base/statistic')
            }]
        },
        {
            path: '/article',
            name: 'user',
            meta: {
                title: '文章管理',
                icon: 'ts-shezhi'
            },
            noDropdown: true,
            component: layout,
            children: [{
                path: 'index',
                alias: '',
                meta: { title: '文章管理' },
                component: lazyload('base/article')
            }]
        },
    ]

    const routes = [...routerMap, ...sideRoutes]

    export {
        sideRoutes,
        routes
    }