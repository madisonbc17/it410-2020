import Vue from 'vue'
import VueRouter from 'vue-router'

// Layouts
import Layout from '@/components/Layout/Layout.vue';
import LayoutHorizontal from '@/components/Layout/LayoutHorizontal.vue';
import LayoutPage from '@/components/Layout/LayoutPage.vue';

// Views
const Welcome = () => import ('@/views/Welcome/Welcome.vue')
const Buttons = () => import ('@/views/Elements/Buttons.vue')
const Cards = () => import ('@/views/Elements/Cards.vue')
const TableStandard = () => import ('@/views/Tables/TableStandard.vue')
const FormStandard = () => import ('@/views/Forms/FormStandard.vue')

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            redirect: '/welcome'
        },
        // Admin Pages
        {
            path: '/',
            component: Layout,
            children: [
                {
                    path: '/welcome',
                    component: Welcome
                }, {
                    path: '/buttons',
                    component: Buttons
                }, {
                    path: '/form-standard',
                    component: FormStandard
                }, {
                    path: '/table-standard',
                    component: TableStandard
                }, {
                    path: '/cards',
                    component: Cards
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