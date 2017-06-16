<template>
      <file-sub-tree :files="files"></file-sub-tree>
</template>

<script>
  import { mapActions } from 'vuex';
  import FileSubTree from './file-sub-tree.vue';

  export default {
    name: 'file-tree',
    components: {
      FileSubTree
    },
    data () {
      return {
      };
    },
    computed: {
      files () {
        return this.$store.state.files.files;
      }
    },
    methods: {
      ...mapActions({
        initializeFiles: 'files/initializeFiles'
      })
    },
    created () {
      this.initializeFiles();
    }
  };
</script>

<style lang="stylus">
</style>
