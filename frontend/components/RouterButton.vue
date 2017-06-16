<template>
  <router-link tag="el-button" :class="buttonClass" :to="to">
    <slot></slot>
  </router-link>
</template>
<script>
  export default {
    props: ['type', 'to'],
    computed: {
      buttonClass () {
        return this.type ? `el-button--${this.type}` : '';
      }
    }
  };
</script>
<style>
</style>
