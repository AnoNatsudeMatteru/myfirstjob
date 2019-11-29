import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard', component: _import('dashboard/index')
    }]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  // {
  //   path: '/controlPanel',
  //   component: Layout,
  //   // redirect: '/controlPanel/',
  //   name: '控制面板',
  //   meta: {title: '控制面板', icon: 'tree'},
  //   children: [
  //     {
  //       path: 'systemManage',
  //       component: () => import('@/views/controlpanel/index'), // Parent router-view
  //       // component: Layout, // Parent router-view
  //       name: '系统设置',
  //       meta: { title: '系统设置' , icon: 'table'},
  //       children: [
  //         {
  //           path: '',
  //           // component: () => import('@/views/controlpanel/systemmanage/environmentsetting'),
  //           component: () => import('@/views/controlpanel/systemmanage/environmentsetting.vue'),
  //           name: '环境设置',
  //           meta: { title: '环境设置', icon: 'table' },
  //           menu: 'environmentSetting'
  //         },
  //         {
  //           path:'characterManage',
  //           component: () => import('@/views/controlpanel/systemmanage/role'),
  //           name: '角色管理',
  //           meta: { title: '角色管理', icon: 'table' },
  //           menu: 'characterManage'
  //         },
  //         {
  //           path: 'permissionSelect',
  //           component: () => import('@/views/controlpanel/systemmanage/permission'),
  //           name: '权限查询',
  //           meta: { title: '权限查询', icon: 'table' },
  //           menu: 'permissionSelect'
  //         }
  //       ]
  //     },
  //     {
  //       path: 'user',
  //       component: () => import('@/views/controlpanel/user/user'),
  //       name: '用户列表',
  //       meta: { title: '用户列表', icon: 'table' },
  //       menu: 'user'
  //     },
  //     {
  //       path: 'webManage',
  //       component: () => import('@/views/controlpanel/webmanage'), // Parent router-view
  //       name: '官网管理',
  //       meta: { title: '官网管理' , icon: 'table'},
  //       children: [
  //         {
  //           path: 'career',
  //           component: () => import('@/views/controlpanel/webmanage/career'),
  //           name: '招聘管理',
  //           meta: { title: '招聘管理', icon: 'table' },
  //           menu: 'career'
  //         },
  //         {
  //           path:'news',
  //           component: () => import('@/views/controlpanel/webmanage/news'),
  //           name: '新闻管理',
  //           meta: { title: '新闻管理', icon: 'table' },
  //           menu: 'news'
  //         },
  //         {
  //           path: 'product',
  //           component: () => import('@/views/controlpanel/webmanage/product'),
  //           name: '产品管理',
  //           meta: { title: '产品管理', icon: 'table' },
  //           menu: 'product'
  //         },
  //         {
  //           path: 'partner',
  //           component: () => import('@/views/controlpanel/webmanage/partner'),
  //           name: '合作伙伴管理',
  //           meta: { title: '合作伙伴管理', icon: 'table' },
  //           menu: 'partner'
  //         }
  //       ]
  //     },
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    // redirect: '/controlPanel/',
    name: '控制面板',
    meta: {title: '控制面板', icon: 'tree'},
    children: [
      {
        path: '/systemManage',
        name: '系统设置',
       component:  _import('controlpanel/systemmanage/environmentsetting'),
        meta:{title: '系统设置', icon: 'table'},
        children: [
          {
            path:'', name: '环境设置', component: _import('controlpanel/systemmanage/environmentsetting'), meta: {title: '环境设置', icon: 'user'}, menu: 'environmentSetting'
          },
          {
            path:'role', name: '角色管理',component: _import('controlpanel/systemmanage/role'), meta: {title: '角色管理', icon: 'user'}, menu: 'characterManage'
          },
          {
            path:'permissionSelect', name: '权限查询',component: _import('controlpanel/systemmanage/permission'), meta: {title: '权限查询', icon: 'user'}, menu: 'permissionSelect'
          }
        ]
      },
      {
        path: '/user',
        component:  _import('controlpanel/user/user'),
        redirect: '/user/',
        name: '用户列表',
        meta: {title: '用户权限', icon: 'table'},
        children: [
          {
            path: '', name: '用户列表', component: _import('controlpanel/user/user'), meta: {title: '用户列表', icon: 'user'}, menu: 'user'
          }
        ]
      },
      {
        path: '/webManage',
        component: Layout,
        redirect: '/webManage/',
        name: '官网管理',
        meta:{title: '官网管理', icon: 'table'},
        children: [
          {
            path:'', name: '招聘管理',component: _import('controlpanel/webmanage/career'), meta: {title: '招聘管理', icon: 'user'}, menu: 'career'
          },
          {
            path:'news', name: '新闻管理',component: _import('controlpanel/webmanage/news'), meta: {title: '新闻管理', icon: 'user'}, menu: 'news'
          },
          {
            path:'product', name: '产品管理',component: _import('controlpanel/webmanage/product'), meta: {title: '产品管理', icon: 'user'}, menu: 'product'
          },
          {
            path:'partner', name: '合作伙伴管理',component: _import('controlpanel/webmanage/partner'), meta: {title: '合作伙伴管理', icon: 'user'}, menu: 'partner'
          }
        ]
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]
