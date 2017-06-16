<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions({
      findBaseURL: 'base/findBaseURL'
    })
  },
  created () {
    this.findBaseURL();
  }
};
</script>

<style></style>
