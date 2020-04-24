<template>
    <ContentWrapper>
        <div class="content-heading">
            <div>Welcome
                <small>{{$t("dashboard.WELCOME")}}</small>
            </div>
            <!-- START Language list-->
            <div class="ml-auto">
                <b-dropdown id="ddown1" :text="selectedLanguage()" no-caret right>
                    <b-dropdown-item @click="changeLanguage('en')">English</b-dropdown-item>
                    <b-dropdown-item @click="changeLanguage('es')">Spanish</b-dropdown-item>
                </b-dropdown>
            </div>
            <!-- END Language list-->
        </div>
        <div class="row">
            <div class="col-12 text-center">
                <h2 class="text-thin">Vue Typescript Starter</h2>
                    <p>
                        This project is an application skeleton. You can use it to quickly bootstrap your VueJS webapp projects and dev environment for these projects.
                        <br/>
                        This starter project offers some examples to work with the template using Typescript and the structure is based on VUE Cli  with <a target="_blank" href="https://vuejs.org/v2/guide/typescript.html" rel="noopener noreferrer">Typescript Support</a>.
                    </p>
            </div>
        </div>
    </ContentWrapper>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    @Component
    export default class SingleView extends Vue {
        selectedLanguage() {
            switch(this.$i18n.i18next.language) {
                case 'es': return 'Spanish'; break;
                case 'en': default: return 'English';
            }
        }
        changeLanguage (lang: string) {
            this.$i18n.i18next.changeLanguage(lang);
        }
    }
</script>