<template>
    <div v-bind="$props">
        {{currentTime}}
    </div>
</template>

<script lang="ts">

    import { Component, Prop, Vue } from 'vue-property-decorator';
    import moment from 'moment';

    /**
     * Updates every second the content of the element
     * with the current time formated
     */
    @Component
    export default class Now extends Vue {
        /** string to format current date */
        @Prop() format: string = 'YYYYMMDD';
        currentTime: any = null;
        interval: number = 0;

        mounted() {
            this.updateTime();
            this.interval = setInterval(this.updateTime, 1000);
        }
        destroyed() {
            if(this.interval)
                clearInterval(this.interval);
        }
        updateTime() {
            this.currentTime = moment(new Date()).format(this.format)
        }

    }
</script>

<style scoped>
    div { display: inline-block; }
</style>
