<template>
  <v-app dark>
    <v-toolbar dark color="primary">
      <v-toolbar-title class="white--text">ghj.io</v-toolbar-title>
      <v-spacer></v-spacer>
       <v-btn icon to="/" exact>
        <v-icon>file_download</v-icon>
      </v-btn>
      <v-btn icon to="send" exact>
        <v-icon>file_upload</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <nuxt/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    components: {
    }
  };
</script>

<style>

</style>
