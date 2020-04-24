<template>
  <div id="app">
    <message-list></message-list>
  </div>
</template>

<script>
import MessageList from './MessageList.vue'
export default {
  name: 'app',
  components: {
    MessageList
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import './styles/bootstrap.scss';
  @import './styles/app.scss';
</style>


