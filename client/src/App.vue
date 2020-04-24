<template>
  <div id="app">
    <class-page></class-page>
  </div>
</template>

<script>
import ClassPage from './ClassPage.vue'
export default {
  name: 'app',
  components: {
    Classpage
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import './styles/bootstrap.scss';
  @import './styles/app.scss';
</style>


