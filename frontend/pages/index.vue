<template>
<v-layout row wrap>
  <v-flex xs12>
    <h2>Receive your files</h2>
  </v-flex>
  <v-flex xs12 md6>
    <h1 class="code"> {{uuid}}</h1>
  </v-flex>
  <v-flex xs12 md6>
     <img :src="qrUrl" alt="mainQr" class="code-qr">
  </v-flex>
  <v-flex xs12>
    <ul class="files-container">
      <li v-for="file in files" :key="file.fileName">
        <i class="el-icon-upload2"></i>
        <a :href="file.path" :download="file.fileName">{{file.fileName}}</a>
      </li>
    </ul>
  </v-flex>
</v-layout>
</template>

<script>
  import RouterButton from '../components/RouterButton.vue';
  import { mapGetters } from 'vuex';

  export default {
    components: {
      RouterButton
    },
    layout: 'main',
    fetch ({store: {dispatch}}) {
      dispatch('ws/generateUUID');
    },
    data () {
      return {};
    },
    computed: {
      ...mapGetters({
        files: 'ws/getFiles',
        uuid: 'ws/getUUID'
      }),
      qrUrl () {
        return 'https://chart.googleapis.com/chart?cht=qr&chs=' + 400 + 'x' + 400 + '&chl=' + encodeURIComponent(this.uuid);
      },
      socketLink () {
        return this.$store.state.socket.isConnected;
      }
    },
    methods: {
      registerToServer () {
        this.$socket.sendObj({uuid: this.uuid});
      }
    },
    watch: {
      socketLink: {
        immediate: true,
        handler: function (link) {
          if (link && !this.$isServer) {
            this.registerToServer();
          }
        }
      }
    }
  };
</script>

<style scoped lang="less">
  .code {
    font-size: 10vh;
  }

  .code-or {
    font-size: 4vh;
  }

  .code-qr {
    width:30vh;
    height: auto;
  }

  .files-container {
    list-style: none;

    li {
      font-size:5vh;
      list-style: none;
    }

    a{
      margin-left: 0.5em;
    }
  }

</style>
