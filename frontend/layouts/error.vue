<template>
  <section class="container">
    <h1 class="title">
      {{ error.statusCode }}
    </h1>
    <h2 class="info">
      {{ error.message }}
    </h2>
    <router-button to="/" v-if="error.statusCode === 404">
      Homepage
    </router-button>
  </section>
</template>
<script>
  import RouterButton from '../components/RouterButton.vue';

  export default {
    props: ['error'],
    components: {
      RouterButton
    }
  };
</script>

<style scoped>
  .title
  {
    margin-top: 15px;
    font-size: 5em;
    width:100%;
  }
  .info
  {
    font-weight: 300;
    color: #9aabb1;
    margin: 0;
    width:100%;
  }
  .button
  {
    margin-top: 50px;
  }
</style>
