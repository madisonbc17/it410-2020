<template>
    <aside class="aside-container">
        <!-- START Sidebar (left)-->
        <div class="aside-inner">
            <nav class="sidebar" data-sidebar-anyclick-close="">
                <!-- START sidebar nav-->
                <ul class="sidebar-nav">
                    <!-- START user info-->
                    <li class="has-user-block">
                        <b-collapse :visible="showUserBlock" id="user-block">
                            <div class="item user-block">
                                <!-- User picture-->
                                <div class="user-block-picture">
                                    <div class="user-block-status">
                                        <img class="img-thumbnail rounded-circle" src="img/user/02.jpg" alt="Avatar" width="60" height="60">
                                        <div class="circle bg-success circle-lg"></div>
                                    </div>
                                </div>
                                <!-- Name and Job-->
                                <div class="user-block-info">
                                    <span class="user-block-name">Hello, Mike</span>
                                    <span class="user-block-role">Designer</span>
                                </div>
                            </div>
                        </b-collapse>
                    </li>
                    <!-- END user info-->
                    <!-- Iterates over all sidebar items-->
                    <template v-for="item in Menu">
                        <!-- Heading -->
                        <li class="nav-heading" v-if="item.heading">
                            <span>{{$t(item.translate) || item.heading}}</span>
                        </li>
                        <!-- Single Menu -->
                        <router-link tag="li" :to="item.path" active-class="active" v-if="!item.heading && !item.submenu">
                            <a :title="tr(item.translate, item.name)">
                                <span v-if="item.label" :class="'float-right badge badge-'+item.label.color">{{item.label.value}}</span>
                                <em :class="item.icon"></em>
                                <span>{{tr(item.translate, item.name)}}</span>
                            </a>
                        </router-link>
                        <!-- Menu With Subitems -->
                        <li :class="routeActiveClass(getSubRoutes(item))" v-if="!item.heading && item.submenu">
                            <a :title="tr(item.translate, item.name)" @click.prevent="toggleItemCollapse(item.name)" href>
                                <span v-if="item.label" :class="'float-right badge badge-'+item.label.color">{{item.label.value}}</span>
                                <em :class="item.icon"></em>
                                <span>{{tr(item.translate, item.name)}}</span>
                            </a>
                            <b-collapse tag="ul" class="sidebar-nav sidebar-subnav" id="item.name" v-model="collapse[item.name]">
                                <li class="sidebar-subnav-header">{{tr(item.translate, item.name)}}</li>
                                <template v-for="sitem in item.submenu">
                                    <router-link tag="li" :to="sitem.path" active-class="active">
                                        <a :title="tr(sitem.translate, sitem.name)">
                                            <span v-if="sitem.label" :class="'float-right badge badge-'+sitem.label.color">{{sitem.label.value}}</span>
                                            <span>{{tr(sitem.translate, sitem.name)}}</span>
                                        </a>
                                    </router-link>
                                </template>
                            </b-collapse>
                        </li>
                    </template>
                </ul>
                <!-- END sidebar nav-->
            </nav>
        </div>
        <!-- END Sidebar (left)-->
    </aside>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { State, Getter, Action, Mutation, namespace } from 'vuex-class';
    import { Watch } from 'vue-property-decorator';

    import Menu, { ISidebarMenuItem } from '@/menu';
    import SidebarRun from './Sidebar.run.js';
    import { ApplicationState } from '@/store/index';

    interface StringBoolArray { [index: string] : boolean }

    @Component
    export default class Sidebar extends Vue {
        Menu = Menu;
        collapse: StringBoolArray = {} as StringBoolArray

        @State((state: ApplicationState) => state.setting.showUserBlock) showUserBlock!: boolean;

        mounted() {
            this.collapse = this.buildCollapseList();
            SidebarRun(this.$router, this.closeSidebar)
        }

        @Watch('$route', { immediate: true, deep: true })
        onUrlChange(newVal: any) {
            this.closeSidebar()
        }

        closeSidebar = () => {
            this.$store.commit('changeSetting', { name: 'asideToggled', value: false })
        }
        buildCollapseList() {
            /** prepare initial state of collapse menus. Doesnt allow same route names */
            let collapse = {} as StringBoolArray;
            Menu
                .filter(({heading}) => !heading)
                .forEach(({name, path, submenu}) => {
                    if (name)
                        collapse[name] = this.isRouteActive(submenu ? submenu.map(({path})=>path) : path)
                })
            return collapse;
        }
        getSubRoutes = (item: ISidebarMenuItem): Array<string> => {
            if(item.submenu)
                item.submenu.map(({path}) => path)
            return [];
        }
        // translate a key or return default values
        tr (key: string, defaultValue: string) {
            return key ? this.$t(key, {defaultValue: defaultValue}) : defaultValue;
        }
        isRouteActive(paths: string | Array<string|undefined> | undefined) {
            paths = Array.isArray(paths) ? paths : [paths];
            return paths.some(p => {
                return p ? this.$route.path.indexOf(p) > -1 : false;
            })
        }
        routeActiveClass(paths: string | Array<string|undefined> | undefined) {
            return { 'active': this.isRouteActive(paths) }
        }
        toggleItemCollapse(collapseName: string) {
            for (let c in this.collapse) {
                if (this.collapse[c] === true && c !== collapseName)
                    this.collapse[c] = false
            }
            this.collapse[collapseName] = !this.collapse[collapseName]
        }

    }
</script>