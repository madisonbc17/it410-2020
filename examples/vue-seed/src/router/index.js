import Vue from 'vue'
import VueRouter from 'vue-router'

// Layouts
import Layout from '@/components/Layout/Layout'
import LayoutHorizontal from '@/components/Layout/LayoutHorizontal'
import LayoutPage from '@/components/Layout/LayoutPage'
// SingleView
const SingleView = () => import ('@/views/SingleView/SingleView.vue')
// SubMenu
const SubMenu = () => import ('@/views/SubMenu/SubMenu.vue')

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            redirect: '/singleview'
        },
        // Admin Pages
        {
            path: '/',
            component: Layout,
            children: [
                {
                    path: '/singleview',
                    component: SingleView
                }, {
                    path: '/submenu',
                    component: SubMenu
                }
            ]
        },
        // Not found route
        {
            path: '*',
            redirect: '/'
        }
    ]
})