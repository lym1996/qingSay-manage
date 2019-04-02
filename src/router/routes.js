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
            path: '/userInformation',
            name: 'user',
            meta: {
                title: '用户管理',
                icon: 'ts-shezhi'
            },
            noDropdown: true,
            component: layout,
            children: [{
                path: 'index',
                alias: '',
                meta: { title: '用户管理' },
                component: lazyload('base/userInformation')
            }] 
        },
    ]

    const routes = [...routerMap, ...sideRoutes]

    export {
        sideRoutes,
        routes
    }