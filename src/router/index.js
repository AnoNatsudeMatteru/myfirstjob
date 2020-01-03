import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'
import Index from '../views/layout/index'
import {AppMain} from "../views/layout/components";
import newsdeatil from "../views/controlpanel/webmanage/newsdeatil";

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
  },
  {
    path: '/newsdeatil',
    component: newsdeatil,
    name: 'newsdeatil',
  }
]
export default new Router({
  mode: 'history', //后端支持可开
  base: '/api/admin',
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/',
    component: Layout,
    // redirect: '/controlPanel/',
    name: '控制面板',
    meta: {title: '控制面板', icon: 'tree'},
    children: [
      {
        path: '',
        name: '系统设置',
       component:  AppMain,
        meta:{title: '系统设置', icon: 'table'},
        children: [
          {
            path:'environmentsetting', name: '环境设置', component: _import('controlpanel/systemmanage/environmentsetting'), meta: {title: '环境设置', icon: 'el-icon-setting'}, menu: 'environmentSetting'
          },
          {
            path:'role', name: '角色管理',component: _import('controlpanel/systemmanage/role'), meta: {title: '角色管理', icon: 'el-icon-user-solid'}, menu: 'characterManage'
          },
          {
            path:'permissionSelect', name: '权限查询',component: _import('controlpanel/systemmanage/permission'), meta: {title: '权限查询', icon: 'el-icon-lock'}, menu: 'permissionSelect'
          }
        ]
      },
      {
        path: '/user',
        component:  _import('controlpanel/user/user'),
        redirect: '/user/users',
        name: '用户列表',
        meta: {title: '用户列表', icon: 'table'},
        children: [
          {
            path: 'users', name: '用户列表', component: _import('controlpanel/user/user'), meta: {title: '用户列表', icon: 'user'}, menu: 'user'
          }
        ]
      },
      {
        path: '/webManage',
        component: AppMain,
        redirect: '/webManage/',
        name: '官网管理',
        meta:{title: '官网管理', icon: 'table'},
        children: [
          {
            path:'', name: '招聘管理',component: _import('controlpanel/webmanage/career'), meta: {title: '招聘管理', icon: 'el-icon-phone'}, menu: 'career'
          },
          {
            path:'news', name: '新闻管理',component: _import('controlpanel/webmanage/news'), meta: {title: '新闻管理', icon: 'el-icon-document'}, menu: 'news'
          },
          {
            path:'product', name: '产品管理',component: _import('controlpanel/webmanage/product'), meta: {title: '产品管理', icon: 'el-icon-s-platform'}, menu: 'product'
          },
          {
            path:'example', name: '案例管理',component: _import('controlpanel/webmanage/example'), meta: {title: '案例管理', icon: 'el-icon-s-platform'}, menu: 'example'
          },
          {
            path:'partner', name: '合作伙伴管理',component: _import('controlpanel/webmanage/partner'), meta: {title: '合作伙伴管理', icon: 'el-icon-s-cooperation'}, menu: 'partner'
          },
          {
            path:'basicInfo', name: '基础信息管理',component: _import('controlpanel/webmanage/basicInfo'), meta: {title: '基础信息管理', icon: 'el-icon-s-cooperation'}, menu: 'basicInfo'
          },
          {
            path:'slideShowPicture', name: '轮播图管理',component: _import('controlpanel/webmanage/slideShowPicture'), meta: {title: '轮播图管理', icon: 'el-icon-s-cooperation'}, menu: 'slideShowPicture'
          }
        ]
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true},
]
