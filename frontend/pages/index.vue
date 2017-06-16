<template>
  <section class="container">
    <div>
      <el-row type="flex" justify="center" align="middle" :gutter="20">
        <el-col :span="6">
          <img :src="qrUrl" alt="mainQr" class="code-qr">
        </el-col>
        <el-col :span="3">
          <h1 class="code-or">OR</h1>
        </el-col>
        <el-col :span="6">
          <h1 class="code"> {{uuid}}</h1>
        </el-col>
      </el-row>



      <ul class="files-container">
        <li v-for="file in files">
          <i class="el-icon-upload2"></i>
          <a :href="file.path">{{file.fileName}}</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import RouterButton from '../components/RouterButton.vue';

  export default {
    components: {
      RouterButton
    },
    layout: 'main',
    data () {
      return {
        uuid: null
      };
    },
    computed: {
      qrUrl () {
        return 'https://chart.googleapis.com/chart?cht=qr&chs=' + 400 + 'x' + 400 + '&chl=' + encodeURIComponent(this.uuid);
      },
      files () {
        return this.$store.state.ws.files;
      }
    },
    methods: {
      registerToServer () {
        this.$socket.sendObj({uuid: this.uuid});
      },
      createUUID () {
        return 'xxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); // eslint-disable-line eqeqeq
          return v.toString(16);
        });
      }
    },
    created () {
      if (!this.$isServer) {
        this.uuid = this.createUUID();
        this.registerToServer();
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
