<template>
  <ul>
    <li v-for="file in files" >
      <span>{{file.name}}</span>
      <template v-if="file.isDir">
        <button class="clear circular extra-small" v-show="!file.open" @click="openDirectory(file)"> <i>add</i></button>
        <button class="clear circular extra-small" v-show="file.open" @click="closeDirectory(file)"> <i>remove</i></button>
        <file-sub-tree :files="file.children" v-if="file.open"></file-sub-tree>
      </template>
    </li>
  </ul>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'file-sub-tree',
    props: ['files'],
    data () {
      return {
      };
    },
    computed: {
    },
    methods: {
      ...mapActions({
        openDirectory: 'files/openDirectory',
        closeDirectory: 'files/closeDirectory'
      })
    }
  };
</script>

<style lang="stylus">
  button.extra-small {
    width:15px;
    height:15px;
  }
</style>
