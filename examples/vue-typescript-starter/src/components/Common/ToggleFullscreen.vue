<template>
    <component :is="tag" v-bind="$props" @click="handleClick">
        <em :class="iconClass"></em>
    </component>
</template>

<script lang="ts">
// FULLSCREEN
// -----------------------------------
import { Component, Prop, Vue } from 'vue-property-decorator';
import screenfull, { Screenfull } from 'screenfull';

const sf = screenfull as Screenfull;

const FSTOGGLER_EVENT = 'click.fstoggler';
const FULLSCREEN_ON_ICON = 'fa fa-expand';
const FULLSCREEN_OFF_ICON = 'fa fa-compress'

@Component
export default class ToggleFullscreen extends Vue {
    @Prop() private tag: string = 'A';
    iconClass: string = FULLSCREEN_ON_ICON;

    mounted() {
        // Not supported under IE
        const ua = window.navigator.userAgent;
        if (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv:11\./)) {
            this.$el.classList.add('d-none');
        }
    }
    handleClick(e: MouseEvent) {
        e.preventDefault();

        if (sf.enabled) {

            sf.toggle();

            this.toggleFSIcon();

        } else {
            console.log('Fullscreen not enabled');
        }
    }
    toggleFSIcon() {
        this.iconClass = sf.isFullscreen ? FULLSCREEN_ON_ICON : FULLSCREEN_OFF_ICON
    }

}

</script>