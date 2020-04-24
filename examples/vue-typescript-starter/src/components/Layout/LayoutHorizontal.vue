<template>
    <div class="wrapper">

        <!-- top navbar-->
        <HeaderHorizontal />

        <!-- offsidebar-->
        <Offsidebar />

        <!-- Main section-->
        <section class="section-container">
            <!-- Page content-->
            <router-view/>
        </section>

        <!-- Page footer-->
        <Footer />

    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { State, Getter, Action, Mutation, namespace } from 'vuex-class';

    import HeaderHorizontal from './HeaderHorizontal.vue';
    import Offsidebar from './Offsidebar.vue';
    import Footer from './Footer.vue';
    import ContentWrapper from './ContentWrapper.vue';

    Vue.component('ContentWrapper', ContentWrapper)

    @Component({
        components: {
            HeaderHorizontal,
            Offsidebar,
            Footer
        }
    })
    export default class Layout extends Vue {
        @Mutation changeSetting: any;
        created() {
            this.changeSetting({name: 'horizontal', value: true})
        }
        destroyed() {
            this.changeSetting({name: 'horizontal', value: false})
        }
    }
</script>