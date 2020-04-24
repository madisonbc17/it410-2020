<template>
    <!-- START Search form-->
    <form :class="{'navbar-form': true, 'open': this.isOpen}" role="search" action="search.html">
        <div class="form-group">
            <input ref="input" class="form-control" type="text" placeholder="Type and hit enter ...">
            <div class="fas fa-times navbar-form-close" v-on:click="onClose"></div>
        </div>
        <button class="d-none" type="submit">Submit</button>
    </form>
    <!-- END Search form-->
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    @Component
    export default class HeaderSearch extends Vue {
        @Prop({required: true}) onClose!: Function;
        @Prop({required: true}) isOpen!: boolean;

        mounted() {
            document.addEventListener('keydown', this.closeNavSearchKey);
            document.addEventListener('click', this.closeNavSearchClick);
        }
        destroyed() {
            document.removeEventListener('keydown', this.closeNavSearchKey);
            document.removeEventListener('click', this.closeNavSearchClick);
        }

        @Watch('isOpen')
        onIsOpenChanged(val: boolean) {
            const input = this.$refs.input as HTMLInputElement;
            if (input) input[val ? 'focus' : 'blur']();
        }

        closeNavSearchKey(e: KeyboardEvent) {
            if (e.keyCode === 27) this.onClose(e);
        }

        closeNavSearchClick(e: MouseEvent) {
            if(this.isOpen && (!(e.target as any).closest('.navbar-form, .nav-link')))
                this.onClose(e);
        }
    }
</script>