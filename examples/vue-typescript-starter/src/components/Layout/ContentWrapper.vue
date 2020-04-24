<template>
    <div class="content-wrapper">
        <div class="unwrap" v-if="unwrap">
            <slot></slot>
        </div>
        <slot v-else></slot>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    @Component
    export default class ContentWrapper extends Vue {
        unwrap: boolean = false;
    }
</script>