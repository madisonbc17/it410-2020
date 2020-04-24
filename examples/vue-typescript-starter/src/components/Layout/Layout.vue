<template>
    <div class="wrapper">

        <!-- top navbar-->
        <Header />

        <!-- sidebar-->
        <Sidebar />

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
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Header from './Header.vue';
    import Sidebar from './Sidebar.vue';
    import Offsidebar from './Offsidebar.vue';
    import Footer from './Footer.vue';
    import ContentWrapper from './ContentWrapper.vue';

    Vue.component('ContentWrapper', ContentWrapper)

    @Component({
        components: {
            Header,
            Sidebar,
            Offsidebar,
            Footer
        }
    })
    export default class Layout extends Vue {}
</script>