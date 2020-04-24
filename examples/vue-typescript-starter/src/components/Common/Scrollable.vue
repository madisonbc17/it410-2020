<!-- SLIMSCROLL
----------------------------------- -->

<template>
    <div v-bind="$props">
        <slot></slot>
    </div>
</template>

<script lang="ts">

    import { Component, Prop, Vue } from 'vue-property-decorator';

    import $ from 'jquery';
    // Slimscroll
    import 'jquery-slimscroll';

    declare global {
        interface JQuery {
            slimScroll(options?: any): JQuery;
        }
    }

    /**
     * Wrapper for jquery-slimscroll plugin
     */
    @Component
    export default class Scrollable extends Vue {
        /** height of the element */
        @Prop() height: number = 250;

        mounted() {
            $(this.$el).slimScroll({
                height: this.height
            });
        }
    }
</script>