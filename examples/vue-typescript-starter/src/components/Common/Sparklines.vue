<!-- SPARKLINE
----------------------------------- -->

<template>
    <component :is="tag" v-bind="$props"></component>
</template>

<script lang="ts">

    import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

    import $ from 'jquery';
    // Sparklines
    import 'jquery-sparkline/jquery.sparkline.min.js';

    declare global {
        interface JQuery {
            sparkline(values: any, options?: any): JQuery;
        }
    }

    const RESIZE_EVENT = 'resize.sparkline';

    /**
     * Wrapper for for jquery-sparkline plugin
     */
    @Component
    export default class Sparkline extends Vue {
        /** sparkline options object */
        @Prop() options: any;
        /** tag to use, defaults to div */
        @Prop() tag: string = 'DIV'
        /** values to display, allows array or csv string */
        @Prop() values: string | Array<string|number> = '';

        dataOptions: any = this.options;
        dataValues: any = this.values;

        @Watch('values')
        onValuesChanged() {
            $(this.$el).sparkline(this.values, this.dataOptions);
        }

        mounted() {
            this.normalizeParams();

            // init sparkline
            $(this.$el).sparkline(this.values, this.dataOptions);

            // allow responsive
            if (this.dataOptions.resize) {
                $(window).on(RESIZE_EVENT, () => {
                    $(this.$el).sparkline(this.values, this.dataOptions);
                });
            }
        }
        destroyed() {
            $(window).off(RESIZE_EVENT);
            $(this.$el).sparkline('destroy');
        }
        normalizeParams() {
            let { options, values } = this;

            options.disableHiddenCheck = true; // allow draw when initially is not visible
            options.type = options.type || 'bar'; // default chart is bar
            values = Array.isArray(values) ? values : values.split(','); // support array of csv strings

            this.dataOptions = options;
            this.dataValues = values;
        }
    }
</script>